import { imageLoader, metaData } from '@cornerstonejs/core';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';

import { ImageId } from '@/types/dicoms';

import { isValidInstance } from './validators/dicoms/instances';

export async function addFile(f: File): Promise<ImageId> {
  const imageId = dicomImageLoader.wadouri.fileManager.add(f) as ImageId;

  // Cache the image
  await imageLoader.loadAndCacheImage(imageId);

  return imageId;
}

export async function addFiles(files: File[]): Promise<ImageId[]> {
  return Promise.all(files.map((f) => addFile(f)));
}
export function getMetadata(imageId: ImageId, type: string) {
  return metaData.get(type, imageId) as unknown;
}

export function getInstance(imageId: ImageId) {
  const instance = getMetadata(imageId, 'instance');

  if (!isValidInstance(instance)) throw new Error('Invalid instance');

  return instance;
}
