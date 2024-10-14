import { Grid, GridItem, HStack } from '@chakra-ui/react';
import { useState } from 'react';

import DropInput from '@/components/ui/DropInput';
import { Layout } from '@/components/ui/LayoutSelector';
import { addFiles } from '@/helpers/dicoms';
import { ImageId } from '@/types/dicoms';

import Panel from './Panel';

interface PanelGroupProps {
  layout: Layout;
}

function PanelGroup({ layout }: PanelGroupProps) {
  const [imageIds, setImageIds] = useState<ImageId[]>([]);

  const handleFileChange = async (files: File[]) => {
    setImageIds(await addFiles(files));
  };

  const [columns, rows] = layout;

  return (
    <DropInput
      key={`${columns}x${rows}`}
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
        templateColumns={`repeat(${columns}, 1fr)`}
        templateRows={`repeat(${rows}, 1fr)`}
        key={`${columns}x${rows}`}
      >
        {Array.from({ length: columns * rows }).map((_, i) => (
          <GridItem key={`panel-${i}-group-${columns}x${rows}`} w="full" h="full">
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
  );
}

export default PanelGroup;
