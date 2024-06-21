/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import DropInput from './components/DropInput';
import Panel from './views/Panel';

const App = () => {
  const panelRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  }, []);

  const handleFileChange = async (files: FileList) => {
    let lastImage;
    for (const file of files) {
      const imageId: string = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      const image = await cornerstone.loadImage(imageId);
      lastImage = image;
    }
    if (lastImage && panelRef.current) cornerstone.displayImage(panelRef.current, lastImage);
  };

  return (
    <DropInput onDrop={handleFileChange} borderColor="black" onDragOverColor="blue">
      <Panel ref={panelRef} />
    </DropInput>
  );
};

export default App;
