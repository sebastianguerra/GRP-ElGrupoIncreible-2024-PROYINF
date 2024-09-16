import dcmjs from 'dcmjs';

import createStudyMetadata from './createStudyMetadata';
import { InstanceMetadata, SeriesMetadata, StudyMetadata } from './dicomTypes';
import pubSubServiceInterface, { IPubSubServiceInterface } from './pubSubServiceInterface';

enum EVENTS {
  STUDY_ADDED = 'event::dicomMetadataStore:studyAdded',
  INSTANCES_ADDED = 'event::dicomMetadataStore:instancesAdded',
  SERIES_ADDED = 'event::dicomMetadataStore:seriesAdded',
  SERIES_UPDATED = 'event::dicomMetadataStore:seriesUpdated',
}

interface DicomMetadataStoreModel {
  studies: StudyMetadata[];
}
const storeModel: DicomMetadataStoreModel = {
  studies: [],
};

function getStudy(StudyInstanceUID: string | undefined): StudyMetadata | undefined {
  return storeModel.studies.find((aStudy) => aStudy.StudyInstanceUID === StudyInstanceUID);
}

function getSeries(StudyInstanceUID: string | undefined, SeriesInstanceUID: string) {
  const study = getStudy(StudyInstanceUID);

  if (!study) {
    return;
  }

  return study.series.find((aSeries) => aSeries.SeriesInstanceUID === SeriesInstanceUID);
}

function getInstance(StudyInstanceUID: string, SeriesInstanceUID: string, SOPInstanceUID: string) {
  const series = getSeries(StudyInstanceUID, SeriesInstanceUID);

  if (!series) {
    return;
  }

  return series.getInstance(SOPInstanceUID);
}

interface IDicomMetadataStore extends IPubSubServiceInterface {
  addInstance: (
    dicomJSONDatasetOrP10ArrayBuffer: InstanceMetadata | ArrayBuffer,
    imageId: string,
  ) => void;
  EVENTS: typeof EVENTS;
  listeners: object;
  addInstances: (instances: InstanceMetadata[], madeInClient?: boolean) => void;
  updateSeriesMetadata: (seriesMetadata: SeriesMetadata) => void;
  addSeriesMetadata: (seriesSummaryMetadata: SeriesMetadata[], madeInClient?: boolean) => void;
  addStudy: (study: StudyMetadata) => void;
  getStudy: (StudyInstanceUID: string | undefined) => StudyMetadata | undefined;
  getStudyInstanceUIDs: () => string[];
  getSeries: (
    StudyInstanceUID: string | undefined,
    SeriesInstanceUID: string,
  ) => SeriesMetadata | undefined;
  getInstance: (
    StudyInstanceUID: string,
    SeriesInstanceUID: string,
    SOPInstanceUID: string,
  ) => InstanceMetadata | undefined;
  getInstanceByImageId: (imageId: string) => InstanceMetadata | undefined;
}

const DicomMetadataStore: IDicomMetadataStore = {
  ...pubSubServiceInterface,
  EVENTS,
  listeners: {},
  addInstance(dicomJSONDatasetOrP10ArrayBuffer: InstanceMetadata | ArrayBuffer, imageId: string) {
    let dicomJSONDataset;

    // If Arraybuffer, parse to DICOMJSON before naturalizing.
    if (dicomJSONDatasetOrP10ArrayBuffer instanceof ArrayBuffer) {
      const dicomData = dcmjs.data.DicomMessage.readFile(dicomJSONDatasetOrP10ArrayBuffer) as {
        dict: InstanceMetadata;
      };

      dicomJSONDataset = dicomData.dict;
    } else {
      dicomJSONDataset = dicomJSONDatasetOrP10ArrayBuffer;
    }

    let naturalizedDataset: InstanceMetadata;

    if (dicomJSONDataset.SeriesInstanceUID === undefined) {
      naturalizedDataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
        dicomJSONDataset,
      ) as InstanceMetadata;
    } else {
      naturalizedDataset = dicomJSONDataset;
    }

    const { StudyInstanceUID } = naturalizedDataset;

    let study = storeModel.studies.find((s) => s.StudyInstanceUID === StudyInstanceUID);

    if (!study) {
      storeModel.studies.push(createStudyMetadata(StudyInstanceUID));
      study = storeModel.studies[storeModel.studies.length - 1];
    }

    const withImageId = { ...naturalizedDataset, imageId };
    study.addInstanceToSeries(withImageId);
    console.log(storeModel.studies);
  },
  addInstances(instances: InstanceMetadata[], madeInClient = false) {
    const { StudyInstanceUID, SeriesInstanceUID } = instances[0];

    let study = storeModel.studies.find((s) => s.StudyInstanceUID === StudyInstanceUID);

    if (!study) {
      storeModel.studies.push(createStudyMetadata(StudyInstanceUID));

      study = storeModel.studies[storeModel.studies.length - 1];
    }

    study.addInstancesToSeries(instances);

    // Broadcast an event even if we used cached data.
    // This is because the mode needs to listen to instances that are added to build up its active displaySets.
    // It will see there are cached displaySets and end early if this Series has already been fired in this
    // Mode session for some reason.
    this._broadcastEvent(EVENTS.INSTANCES_ADDED, {
      StudyInstanceUID,
      SeriesInstanceUID,
      madeInClient,
    });
  },
  updateSeriesMetadata(seriesMetadata: SeriesMetadata) {
    const { StudyInstanceUID, SeriesInstanceUID } = seriesMetadata;
    const series = getSeries(StudyInstanceUID, SeriesInstanceUID);
    if (!series) {
      return;
    }

    const study = getStudy(StudyInstanceUID);
    if (study) {
      study.setSeriesMetadata(SeriesInstanceUID, seriesMetadata);
    }
  },
  addSeriesMetadata(seriesSummaryMetadata: SeriesMetadata[] | undefined, madeInClient = false) {
    if (!seriesSummaryMetadata?.length || !seriesSummaryMetadata[0]) {
      return;
    }

    const { StudyInstanceUID } = seriesSummaryMetadata[0];
    if (!StudyInstanceUID) {
      return;
    }
    let study = getStudy(StudyInstanceUID);
    if (!study) {
      study = createStudyMetadata(StudyInstanceUID);
      // Will typically be undefined with a compliant DICOMweb server, reset later
      study.StudyDescription = seriesSummaryMetadata[0].StudyDescription;
      seriesSummaryMetadata.forEach((item) => {
        if (item.Modality && !study?.ModalitiesInStudy.includes(item.Modality)) {
          study?.ModalitiesInStudy.push(item.Modality ?? '');
        }
      });
      study.NumberOfStudyRelatedSeries = seriesSummaryMetadata.length;
      storeModel.studies.push(study);
    }

    seriesSummaryMetadata.forEach((series) => {
      const { SeriesInstanceUID } = series;

      study.setSeriesMetadata(SeriesInstanceUID, series);
    });

    this._broadcastEvent(EVENTS.SERIES_ADDED, {
      StudyInstanceUID,
      seriesSummaryMetadata,
      madeInClient,
    });
  },
  addStudy(study: StudyMetadata) {
    const { StudyInstanceUID } = study;

    const existingStudy = storeModel.studies.find((s) => s.StudyInstanceUID === StudyInstanceUID);

    if (!existingStudy) {
      const newStudy = createStudyMetadata(StudyInstanceUID);

      newStudy.PatientID = study.PatientID;
      newStudy.PatientName = study.PatientName;
      newStudy.StudyDate = study.StudyDate;
      newStudy.ModalitiesInStudy = study.ModalitiesInStudy;
      newStudy.StudyDescription = study.StudyDescription;
      newStudy.AccessionNumber = study.AccessionNumber;
      newStudy.NumInstances = study.NumInstances;

      storeModel.studies.push(newStudy);
    }
  },
  getInstanceByImageId(imageId: string) {
    for (const study of storeModel.studies) {
      for (const series of study.series) {
        for (const instance of series.instances) {
          if (instance.imageId === imageId) {
            return instance;
          }
        }
      }
    }
  },
  getStudyInstanceUIDs() {
    return storeModel.studies.map((aStudy) => aStudy.StudyInstanceUID);
  },
  getStudy,
  getSeries,
  getInstance,
};

export { DicomMetadataStore };
export default DicomMetadataStore;
