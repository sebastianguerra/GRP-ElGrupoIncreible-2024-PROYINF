import { Grid, GridItem, HStack, IconButton, Input } from '@chakra-ui/react';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';
import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

import DropInput from '@/components/ui/DropInput';
import { Layout } from '@/components/ui/LayoutSelector';
import { ImageId } from '@/types/dicoms';

import Panel from './Panel';

interface PanelGroupProps {
  layout: Layout;
}

function PanelGroup({ layout }: PanelGroupProps) {
  const [imageIds, setImageIds] = useState<ImageId[]>([]);

  const handleFileChange = async (files: File[]) =>
    files.map((f) => {
      setImageIds((prev) => [...prev, dicomImageLoader.wadouri.fileManager.add(f) as ImageId]);
    });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [columns, rows] = layout;

  return (
    <>
      <DropInput
        key={`${columns.toString()}x${rows.toString()}`}
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
          key={`${columns.toString()}x${rows.toString()}`}
        >
          {Array.from({ length: columns * rows }).map((_, i) => (
            <GridItem
              key={`panel-${i.toString()}-group-${columns.toString()}x${rows.toString()}`}
              w="full"
              h="full"
            >
              <Panel
                imageIds={imageIds}
                w="full"
                h="full"
                bgColor="darkgray"
                borderWidth="1px"
                borderStyle="solid"
                borderRadius="5px"
              />
            </GridItem>
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
        onClick={() => fileInputRef.current?.click()}
        colorScheme="cyan"
      />
    </>
  );
}

export default PanelGroup;
