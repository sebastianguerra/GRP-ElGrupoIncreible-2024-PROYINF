import * as cornerstone from '@cornerstonejs/core';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';

import { ImageId } from '@/types/dicoms';

export async function addFile(f: File): Promise<ImageId> {
  const imageId = dicomImageLoader.wadouri.fileManager.add(f) as ImageId;

  // Cache the image
  await cornerstone.imageLoader.loadAndCacheImage(imageId);

  return imageId;
}

export async function addFiles(files: File[]): Promise<ImageId[]> {
  return Promise.all(files.map((f) => addFile(f)));
}
