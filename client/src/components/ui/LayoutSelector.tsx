import {
  Grid,
  GridItem,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { LuLayoutGrid, LuSquare } from 'react-icons/lu';

interface LayoutSelectorProps {
  layout: [number, number];
  setLayout: (layout: [number, number]) => void;
}

function LayoutSelector({ layout, setLayout }: LayoutSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton icon={<LuLayoutGrid />} aria-label="Seleccionar diseño" />
      </PopoverTrigger>
      <PopoverContent w="min-content">
        <PopoverHeader>
          <Text color="white">Seleccionar diseño</Text>
        </PopoverHeader>

        <PopoverBody w="min-content">
          <Grid templateColumns="repeat(4, 1fr)" gap={0}>
            {Array.from({ length: 4 }, (_, j) =>
              Array.from({ length: 4 }, (__, i) => (
                <GridItem colSpan={1} w="min-content" key={`${j.toString()}-${i.toString()}`}>
                  <IconButton
                    icon={<LuSquare />}
                    aria-label="Seleccionar diseño"
                    onClick={() => {
                      setLayout([i + 1, j + 1]);
                    }}
                    colorScheme={layout[0] >= i + 1 && layout[1] >= j + 1 ? 'blue' : 'gray'}
                  />
                </GridItem>
              )),
            )}
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default LayoutSelector;
