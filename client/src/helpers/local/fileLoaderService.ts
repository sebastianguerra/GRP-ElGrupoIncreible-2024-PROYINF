import dicomImageLoader from '@cornerstonejs/dicom-image-loader';
import dcmjs from 'dcmjs';

import { ImageId, InstanceMetadata } from '@/types/dicoms';

class FileLoaderService {
  addFile(file: File) {
    return dicomImageLoader.wadouri.fileManager.add(file) as ImageId;
  }

  loadFile(imageId: ImageId): Promise<ArrayBuffer> {
    return dicomImageLoader.wadouri.loadFileRequest(imageId);
  }

  getDataset(image: ArrayBuffer): InstanceMetadata {
    const dicomData = dcmjs.data.DicomMessage.readFile(image);

    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
      dicomData.dict,
    ) as InstanceMetadata;

    return dataset;
  }
}

export default FileLoaderService;
