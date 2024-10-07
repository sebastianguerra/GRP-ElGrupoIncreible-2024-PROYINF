import { Box, DarkMode, HStack, IconButton, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';

import DicomHeaderPopover from '@/components/business/DicomHeaderPopover';
import PanelGroup from '@/components/business/PanelGroup';
import LayoutSelector from '@/components/ui/LayoutSelector';
import { useAuth } from '@/contexts/authContext';

function Viewer() {
  const { logout } = useAuth();

  const [layout, setLayout] = useState<[number, number]>([1, 1]);

  return (
    <DarkMode>
      <Box p={4} bgColor="gray.800" h="100vh" w="full" overflow="hidden">
        <HStack h="full">
          <VStack h="full" justifyContent="space-between">
            <VStack>
              <LayoutSelector layout={layout} setLayout={setLayout} />
              <DicomHeaderPopover />
            </VStack>
            <IconButton
              icon={<FiLogOut />}
              onClick={logout}
              colorScheme="red"
              aria-label="logout"
            />
          </VStack>

          <PanelGroup columns={layout[0]} rows={layout[1]} />
        </HStack>
      </Box>
    </DarkMode>
  );
}

export default Viewer;
