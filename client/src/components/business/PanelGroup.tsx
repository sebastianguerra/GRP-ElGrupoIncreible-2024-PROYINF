import { Button, Grid, GridItem, HStack, Input, VStack } from '@chakra-ui/react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import React, { useEffect } from 'react';
import Select from 'react-select';

import DropInput from '@/components/ui/DropInput';

import Panel from './Panel';

interface PanelGroupProps {
  columns: number;
  rows: number;
}

function PanelGroup({ columns, rows }: PanelGroupProps) {
  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  }, []);

  const [selectedImageSet, setSelectedImageSet] = React.useState<number | null>(null);

  const [imgSets, setImgSets] = React.useState<string[][]>([]);

  const [imgs, setImgs] = React.useState<
    Record<number, { imageId: string; instanceNumber: number }[]>
  >({});

  const handleFileChange = async (files: FileList) => {
    for (const file of files) {
      const [, imgSet, imgId] = file.name
        .split('.')[0]
        .split('-')
        .map((s) => parseInt(s, 10));

      if (!imgSets[imgSet]) {
        setImgSets((prev) => {
          const newImgSets = [...prev];
          newImgSets[imgSet] = [];
          return newImgSets;
        });
      }

      const imageId: string = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

      setImgs((prev) => {
        if (!(imgSet in prev)) {
          return {
            ...prev,
            [imgSet]: [{ imageId, instanceNumber: imgId }],
          };
        }
        return {
          ...prev,
          [imgSet]: [...prev[imgSet], { imageId, instanceNumber: imgId }].reduce<
            { imageId: string; instanceNumber: number }[]
          >((acc, cur) => {
            const instances = acc.map((img) => img.instanceNumber);
            if (instances.includes(cur.instanceNumber)) {
              return acc;
            }
            return [...acc, cur].sort((a, b) => a.instanceNumber - b.instanceNumber);
          }, []),
        };
      });
      setSelectedImageSet(imgSet);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <VStack h="full" w="full" alignItems="stretch">
      <HStack>
        <Select
          value={
            selectedImageSet
              ? { value: selectedImageSet, label: selectedImageSet.toString() }
              : null
          }
          styles={{
            container: (provided) => ({
              ...provided,
              width: '80%',
            }),
          }}
          options={Object.keys(imgSets)
            .filter((key) => imgSets[parseInt(key, 10)])
            .map((key) => ({
              value: parseInt(key, 10),
              label: key,
            }))}
          onChange={(selected) => {
            setSelectedImageSet(selected?.value ?? null);
          }}
        />
        <Input
          ref={fileInputRef}
          display="none"
          type="file"
          multiple
          onChange={(e) => e.target.files && void handleFileChange(e.target.files)}
        />
        <Button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          Add files
        </Button>
      </HStack>
      <DropInput
        key={columns * rows}
        onDrop={(files) => void handleFileChange(files)}
        borderColor="black"
        onDragOverColor="blue"
        h="90%"
        w="full"
        as={HStack}
      >
        <Grid
          w="full"
          h="full"
          bgColor="black"
          templateColumns={`repeat(${columns.toString()}, 1fr)`}
          templateRows={`repeat(${rows.toString()}, 1fr)`}
        >
          {Array.from({ length: columns * rows })
            .map((_, i) => (
              <Panel
                key={i}
                imageIds={selectedImageSet ? imgs[selectedImageSet].map((img) => img.imageId) : []}
                w="full"
                h="full"
                bgColor="darkgray"
                borderWidth="1px"
                borderStyle="solid"
                borderRadius="5px"
              />
            ))
            .map((panel, i) => (
              <GridItem key={i}>{panel}</GridItem>
            ))}
        </Grid>
      </DropInput>
    </VStack>
  );
}

export default PanelGroup;
