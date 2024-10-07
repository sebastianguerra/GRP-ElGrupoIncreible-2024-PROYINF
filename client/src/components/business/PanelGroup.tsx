import { Grid, GridItem, HStack, IconButton, Input } from '@chakra-ui/react';
import React from 'react';
import { FiUpload } from 'react-icons/fi';

import DropInput from '@/components/ui/DropInput';
import DicomMetadataStore from '@/helpers/DicomMetadataStore/DicomMetadataStore';
import filesToStudies from '@/helpers/local/filesToStudies';

import Panel from './Panel';

interface PanelGroupProps {
  columns: number;
  rows: number;
}

function PanelGroup({ columns, rows }: PanelGroupProps) {
  const [imageIds, setImageIds] = React.useState<string[]>([]);

  const handleFileChange = async (files: File[]) => {
    const studies = await filesToStudies(files);
    console.log('studies', studies);

    const studyObjects = studies.map((s) => DicomMetadataStore.getStudy(s)).filter((s) => !!s);
    console.log('studyObjects', studyObjects);

    const series = studyObjects.flatMap((s) => s.series);
    console.log('series', series);

    const instances = series.flatMap((s) => s.instances);
    console.log('instances', instances);

    const imageIds2 = instances.map((i) => i.imageId);
    console.log('imageIds', imageIds2);
    setImageIds(imageIds2);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <DropInput
        key={columns * rows}
        onDrop={(files) => void handleFileChange(Array.from(files))}
        borderColor="black"
        onDragOverColor="blue"
        h="full"
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
                imageIds={imageIds}
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
      <Input
        ref={fileInputRef}
        display="none"
        type="file"
        multiple
        onChange={(e) => e.target.files && void handleFileChange(Array.from(e.target.files))}
      />
      <IconButton
        position="absolute"
        bottom="30px"
        right="30px"
        borderRadius="full"
        icon={<FiUpload />}
        aria-label="Subir archivos"
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        colorScheme="cyan"
      >
        Add files
      </IconButton>
    </>
  );
}

export default PanelGroup;
