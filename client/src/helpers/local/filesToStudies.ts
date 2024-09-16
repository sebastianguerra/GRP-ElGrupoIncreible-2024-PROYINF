import * as cornerstone from '@cornerstonejs/core';

import { DicomMetadataStore } from '@/helpers/DicomMetadataStore/DicomMetadataStore';
import { InstanceMetadata } from '@/helpers/DicomMetadataStore/dicomTypes';

import FileLoaderService from './fileLoaderService';

const processFile = async (file: File) => {
  try {
    const fileLoaderService = new FileLoaderService();
    const imageId = fileLoaderService.addFile(file);
    const image = await fileLoaderService.loadFile(file, imageId);
    const dicomJSONDataset = fileLoaderService.getDataset(image, imageId);

    DicomMetadataStore.addInstance(dicomJSONDataset as InstanceMetadata, imageId);

    console.log('ImageId:', imageId);
    console.log(cornerstone.metaData.get('studyInstanceUID', imageId));
    console.log(DicomMetadataStore.getInstanceByImageId(imageId));
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'name' in error && 'message' in error) {
      console.log(error.name, ':Error when trying to load and process local files:', error.message);
    } else {
      console.log('Error when trying to load and process local files:', error);
    }
  }
};

export default async function filesToStudies(files: File[]) {
  await Promise.all(files.map(processFile));

  return DicomMetadataStore.getStudyInstanceUIDs();
}
