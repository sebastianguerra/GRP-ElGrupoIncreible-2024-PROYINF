import DicomMetadataStore from '@/helpers/DicomMetadataStore/DicomMetadataStore';

import FileLoaderService from './fileLoaderService';

const processFile = async (file: File) => {
  try {
    const fileLoaderService = new FileLoaderService();
    const imageId = fileLoaderService.addFile(file);
    const image = await fileLoaderService.loadFile(imageId);
    const dicomJSONDataset = fileLoaderService.getDataset(image);

    DicomMetadataStore.addInstance(dicomJSONDataset, imageId);
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
