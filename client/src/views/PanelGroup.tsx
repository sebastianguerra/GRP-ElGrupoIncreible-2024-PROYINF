/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useMemo } from 'react';

import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import DropInput from '../components/DropInput';
import Panel from './Panel';

interface PanelGroupProps {
  columns: number;
  rows: number;
}

const PanelGroup: React.FC<PanelGroupProps> = ({ columns, rows }) => {
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
      key={columns * rows}
      onDrop={(files) => void handleFileChange(files)}
      borderColor="black"
      onDragOverColor="blue"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          display: 'grid',
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          gridTemplateColumns: `repeat(${columns.toString()}, 1fr)`,
          gridTemplateRows: `repeat(${rows.toString()}, 1fr)`,
        }}
      >
        {Array.from({ length: columns * rows }).map((_, i) => (
          <Panel
            key={i}
            imageIds={cleanList[i] ?? []}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'darkgray',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '5px',
            }}
          />
        ))}
      </div>
    </DropInput>
  );
};

export default PanelGroup;
