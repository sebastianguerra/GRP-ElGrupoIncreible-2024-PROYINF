/* eslint-disable @typescript-eslint/no-extraneous-class */

declare module 'dcmjs' {
  declare namespace data {
    export class DicomDict {
      constructor(meta: object);
      dict: object;

      write(writeOptions?: object): string;
      meta: object;
    }
    export class DicomMessage {
      static readFile(arrayBuffer: ArrayBuffer): DicomDict;
    }
    export class DicomMetaDictionary {
      static uid(): string;
      static date(): string;
      static time(): string;
      static dateTime(): string;
      static denaturalizeDataset(object): object;
      static naturalizeDataset(object): object;
      static namifyDataset(object): object;
      static cleanDataset(object): object;
      static punctuateTag(string): string;
      static unpunctuateTag(string): string;
    }
  }
}

declare module '@cornerstonejs/dicom-image-loader' {
  export const external: {
    cornerstone: ModuleNamespace;
    dicomParser: ModuleNamespace;
  };
  export const wadouri: {
    loadFileRequest(imageId: string): Promise<ArrayBuffer>;
    fileManager: {
      add(file: Blob): string;
    };
    loadImage(imageId: string): Promise<unknown>;
  };
}
