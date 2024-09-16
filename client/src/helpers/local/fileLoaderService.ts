import dicomImageLoader from '@cornerstonejs/dicom-image-loader';
import dcmjs from 'dcmjs';

class FileLoaderService {
  addFile(file: File) {
    return dicomImageLoader.wadouri.fileManager.add(file);
  }

  loadFile(_: unknown, imageId: string): Promise<ArrayBuffer> {
    return dicomImageLoader.wadouri.loadFileRequest(imageId);
  }

  getDataset(image: ArrayBuffer, imageId: string): object {
    const dicomData = dcmjs.data.DicomMessage.readFile(image);

    interface DicomDataset {
      url: string;
      _meta: {
        TransferSyntaxUID?: { Value: string[] };
      };
      AvailableTransferSyntaxUID?: string;
    }
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
      dicomData.dict,
    ) as DicomDataset;

    dataset.url = imageId;
    dataset._meta = dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta);
    dataset.AvailableTransferSyntaxUID =
      dataset.AvailableTransferSyntaxUID ?? dataset._meta.TransferSyntaxUID?.Value[0];

    return dataset;
  }
}

export default FileLoaderService;
