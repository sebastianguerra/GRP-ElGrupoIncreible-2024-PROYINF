import dcmjs from 'dcmjs';

import createStudyMetadata from './createStudyMetadata';
import { InstanceMetadata, SeriesMetadata, StudyMetadata } from './dicomTypes';
import { PubSubInterface } from './pubSubServiceInterface';

type EventTypes = 'studyAdded' | 'instancesAdded' | 'seriesAdded' | 'seriesUpdated';

interface EventsMap extends Record<EventTypes, object> {
  studyAdded: { study: StudyMetadata };
  instancesAdded: { StudyInstanceUID: string; SeriesInstanceUID?: string; madeInClient: boolean };
  seriesAdded: {
    StudyInstanceUID: string;
    seriesSummaryMetadata: SeriesMetadata[];
    madeInClient: boolean;
  };
  seriesUpdated: { StudyInstanceUID: string; SeriesInstanceUID: string };
}

class DicomMetadataStore extends PubSubInterface<EventTypes, EventsMap> {
  storeModel: {
    studies: StudyMetadata[];
  } = {
    studies: [],
  };

  getStudy(StudyInstanceUID: string | undefined): StudyMetadata | undefined {
    return this.storeModel.studies.find((aStudy) => aStudy.StudyInstanceUID === StudyInstanceUID);
  }

  getSeries(StudyInstanceUID: string | undefined, SeriesInstanceUID: string) {
    const study = this.getStudy(StudyInstanceUID);

    if (!study) {
      return;
    }

    return study.series.find((aSeries) => aSeries.SeriesInstanceUID === SeriesInstanceUID);
  }

  getInstance(StudyInstanceUID: string, SeriesInstanceUID: string, SOPInstanceUID: string) {
    const series = this.getSeries(StudyInstanceUID, SeriesInstanceUID);

    if (!series) {
      return;
    }

    return series.getInstance(SOPInstanceUID);
  }

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

    let study = this.storeModel.studies.find((s) => s.StudyInstanceUID === StudyInstanceUID);

    if (!study) {
      this.storeModel.studies.push(createStudyMetadata(StudyInstanceUID));
      study = this.storeModel.studies[this.storeModel.studies.length - 1];
    }

    const withImageId = { ...naturalizedDataset, imageId };
    study.addInstanceToSeries(withImageId);
  }

  addInstances(instances: InstanceMetadata[], madeInClient = false) {
    const { StudyInstanceUID, SeriesInstanceUID } = instances[0];

    let study = this.storeModel.studies.find((s) => s.StudyInstanceUID === StudyInstanceUID);

    if (!study) {
      this.storeModel.studies.push(createStudyMetadata(StudyInstanceUID));

      study = this.storeModel.studies[this.storeModel.studies.length - 1];
    }

    study.addInstancesToSeries(instances);

    this.broadcastEvent('instancesAdded', {
      StudyInstanceUID,
      SeriesInstanceUID,
      madeInClient,
    });
  }

  updateSeriesMetadata(seriesMetadata: SeriesMetadata) {
    const { StudyInstanceUID, SeriesInstanceUID } = seriesMetadata;
    const series = this.getSeries(StudyInstanceUID, SeriesInstanceUID);
    if (!series) {
      return;
    }

    const study = this.getStudy(StudyInstanceUID);
    if (study) {
      study.setSeriesMetadata(SeriesInstanceUID, seriesMetadata);
    }
  }

  addSeriesMetadata(seriesSummaryMetadata: SeriesMetadata[] | undefined, madeInClient = false) {
    if (!seriesSummaryMetadata?.length || !seriesSummaryMetadata[0]) {
      return;
    }

    const { StudyInstanceUID } = seriesSummaryMetadata[0];
    if (!StudyInstanceUID) {
      return;
    }
    let study = this.getStudy(StudyInstanceUID);
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
      this.storeModel.studies.push(study);
    }

    seriesSummaryMetadata.forEach((series) => {
      const { SeriesInstanceUID } = series;

      study.setSeriesMetadata(SeriesInstanceUID, series);
    });

    this.broadcastEvent('seriesAdded', {
      StudyInstanceUID,
      seriesSummaryMetadata,
      madeInClient,
    });
  }

  addStudy(study: StudyMetadata) {
    const { StudyInstanceUID } = study;

    const existingStudy = this.storeModel.studies.find(
      (s) => s.StudyInstanceUID === StudyInstanceUID,
    );

    if (!existingStudy) {
      const newStudy = createStudyMetadata(StudyInstanceUID);

      newStudy.PatientID = study.PatientID;
      newStudy.PatientName = study.PatientName;
      newStudy.StudyDate = study.StudyDate;
      newStudy.ModalitiesInStudy = study.ModalitiesInStudy;
      newStudy.StudyDescription = study.StudyDescription;
      newStudy.AccessionNumber = study.AccessionNumber;
      newStudy.NumInstances = study.NumInstances;

      this.storeModel.studies.push(newStudy);
    }
  }

  getInstanceByImageId(imageId: string) {
    for (const study of this.storeModel.studies) {
      for (const series of study.series) {
        for (const instance of series.instances) {
          if (instance.imageId === imageId) {
            return instance;
          }
        }
      }
    }
  }

  getStudyInstanceUIDs() {
    return this.storeModel.studies.map((aStudy) => aStudy.StudyInstanceUID);
  }
}

export default new DicomMetadataStore();
