import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuLayoutGrid } from 'react-icons/lu';
import { TbColumns3 } from 'react-icons/tb';

export type Layout =
  | {
      type: 'stack-grid';
      grid: [number, number];
    }
  | {
      type: 'MPR';
      grid: [3, 1];
    };

export type LayoutType = Layout['type'];

interface LayoutSelectorProps {
  layout: Layout;
  setLayout: (layout: Layout) => void;
}

export default function LayoutSelector({ layout, setLayout }: LayoutSelectorProps) {
  const [hoveredBox, setHoveredBox] = useState<[number, number]>([-1, -1]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tabs: {
    type: LayoutType;
    title: string;
    content: React.ReactNode;
    icon: React.ReactElement;
  }[] = [
    {
      type: 'stack-grid',
      icon: <LuLayoutGrid />,
      title: 'Stack',
      content: (
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={0}
          onMouseLeave={() => {
            setHoveredBox([-1, -1]);
          }}
        >
          {Array.from({ length: 4 }, (_, j) =>
            Array.from({ length: 4 }, (__, i) => (
              <GridItem colSpan={1} w="min-content" key={`${j}-${i}`}>
                <Box
                  w="50px"
                  h="50px"
                  bgColor={hoveredBox[0] >= i + 1 && hoveredBox[1] >= j + 1 ? 'darkblue' : 'gray'}
                  onClick={() => {
                    onClose();
                    setLayout({ type: 'stack-grid', grid: [i + 1, j + 1] });
                  }}
                  border="1px solid black"
                  onMouseEnter={() => {
                    setHoveredBox([i + 1, j + 1]);
                  }}
                  _hover={{
                    cursor: 'pointer',
                  }}
                />
              </GridItem>
            )),
          )}
        </Grid>
      ),
    },
    {
      type: 'MPR',
      icon: <TbColumns3 />,
      title: 'MPR',
      content: (
        <Center p={4}>
          <Button
            onClick={() => {
              setLayout({ type: 'MPR', grid: [3, 1] });
              onClose();
            }}
          >
            <Text>Usar MPR</Text>
          </Button>
        </Center>
      ),
    },
  ];

  const currentTabIdx = tabs.findIndex((tab) => tab.type === layout.type);
  const currentTab = tabs[currentTabIdx];
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(currentTabIdx);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton icon={currentTab.icon} aria-label="Seleccionar diseño" />
      </PopoverTrigger>
      <PopoverContent w="fit-content">
        <PopoverBody p={0}>
          <Tabs
            variant="enclosed"
            isFitted
            index={selectedTabIdx}
            onChange={setSelectedTabIdx}
            isLazy
          >
            <TabList>
              {tabs.map((tab, i) => (
                <Tab key={i} color="white">
                  {tab.title}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {tabs.map((tab, i) => (
                <TabPanel key={i} p={0}>
                  {tab.content}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
