import { Grid, GridItem, HStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import DropInput from '@/components/ui/DropInput';
import { Layout } from '@/components/ui/LayoutSelector';
import { addFiles, getInstance } from '@/helpers/dicoms';
import { ImageId } from '@/types/dicoms';

import MPRPanels from './MPRPanels';
import Panel from './Panel';

interface PanelGroupProps {
  layout: Layout;
}

function PanelGroup({ layout }: PanelGroupProps) {
  const [imageIdsUnordered, setImageIds] = useState<ImageId[]>([]);
  const imageIds = useMemo(
    () =>
      imageIdsUnordered.toSorted(
        (a, b) => getInstance(a).SliceLocation - getInstance(b).SliceLocation,
      ),
    [imageIdsUnordered],
  );

  const handleFileChange = async (files: File[]) => {
    setImageIds(await addFiles(files));
  };

  const [columns, rows] = layout.grid;

  return (
    <DropInput
      key={`${layout.type}-${columns}x${rows}_dropinput`}
      onDrop={(files) => void handleFileChange(Array.from(files))}
      borderColor="black"
      onDragOverColor="blue"
      h="full"
      w="full"
      as={HStack}
    >
      {layout.type === 'stack-grid' && (
        <Grid
          w="full"
          h="full"
          bgColor="black"
          templateColumns={`repeat(${columns}, 1fr)`}
          templateRows={`repeat(${rows}, 1fr)`}
          key={`${layout.type}-${columns}x${rows}_grid`}
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
      )}
      {layout.type === 'MPR' && <MPRPanels imageIds={imageIds} />}
    </DropInput>
  );
}

export default PanelGroup;
