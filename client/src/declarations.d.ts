declare module 'cornerstone-wado-image-loader' {
  export const external: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cornerstone: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dicomParser: any;
  };
  export const wadouri: {
    fileManager: {
      add: (file: File) => string;
    };
  };
}
