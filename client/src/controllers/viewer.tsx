/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useMemo } from 'react';

import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import DropInput from '../components/DropInput';
import Panel from '../views/Panel';

const Viewer = () => {
  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  }, []);

  const [imgs, setImgs] = React.useState<string[][]>([]);
  const cleanList = useMemo(() => {
    return (
      imgs
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .map((stack) => stack?.filter((x) => x))
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .filter((x) => x?.length > 0)
    );
  }, [imgs]);

  const handleFileChange = async (files: FileList) => {
    for (const file of files) {
      const [, imgSet, imgId] = file.name
        .split('.')[0]
        .split('-')
        .map((s) => parseInt(s, 10));

      const imageId: string = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

      setImgs((prev) => {
        const newImgs = [...prev];
        if (!newImgs[imgSet]) newImgs[imgSet] = [];
        newImgs[imgSet][imgId] = imageId;
        return newImgs;
      });
    }
  };

  return (
    <DropInput
      onDrop={handleFileChange}
      borderColor="black"
      onDragOverColor="blue"
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {cleanList.map((stack, i) => (
        <Panel
          key={i}
          imageIds={stack}
          style={{
            width: `${(100 / cleanList.length).toString(10)}%`,
            height: '100%',
          }}
        />
      ))}
    </DropInput>
  );
};

export default Viewer;
