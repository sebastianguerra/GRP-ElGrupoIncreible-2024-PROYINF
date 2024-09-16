export interface InstanceMetadata {
  SOPInstanceUID: string;
  SOPClassUID: string;
  Rows: number;
  Columns: number;
  PatientSex: string;
  Modality: string;
  InstanceNumber: string;
  SeriesInstanceUID?: string;
  StudyDescription: string;
  imageId: string;
  StudyInstanceUID: string;
}

export interface SeriesMetadata {
  SeriesInstanceUID: string;
  StudyInstanceUID?: string;
  StudyDescription?: string;
  instances: InstanceMetadata[];
  addInstance: (newInstance: InstanceMetadata) => void;
  addInstances: (newInstances: InstanceMetadata[]) => void;
  getInstance: (SOPInstanceUID: string) => InstanceMetadata | undefined;
  Modality?: string;
}

export interface StudyMetadata {
  series: SeriesMetadata[];
  StudyInstanceUID: string;
  StudyDescription?: string;
  ModalitiesInStudy: string[];
  isLoaded: boolean;
  addInstanceToSeries: (instance: InstanceMetadata) => void;
  addInstancesToSeries: (instances: InstanceMetadata[]) => void;
  setSeriesMetadata: (SeriesInstanceUID: string, seriesMetadata: SeriesMetadata) => void;
  PatientID?: string;
  PatientName?: string;
  StudyDate?: string;
  AccessionNumber?: string;
  NumInstances?: number;
  NumberOfStudyRelatedSeries?: number;
}
