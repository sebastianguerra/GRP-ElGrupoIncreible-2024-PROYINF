import { Box, Button, DarkMode, HStack, Input, Text, useNumberInput } from '@chakra-ui/react';
import * as cornerstone from '@cornerstonejs/core';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';
import * as cornerstoneTools from '@cornerstonejs/tools';
import dicomParser from 'dicom-parser';

import PanelGroup from '@/components/business/PanelGroup';
import { useAuth } from '@/contexts/authContext';

await cornerstone.init();
cornerstoneTools.init({});
dicomImageLoader.external.cornerstone = cornerstone;
dicomImageLoader.external.dicomParser = dicomParser;

const { StackScrollMouseWheelTool, ToolGroupManager } = cornerstoneTools;
cornerstoneTools.addTool(StackScrollMouseWheelTool);
const toolGroup = ToolGroupManager.createToolGroup('toolGroupId');
console.log('toolGroup', toolGroup);
toolGroup?.addTool(StackScrollMouseWheelTool.toolName as string);

toolGroup?.setToolActive(StackScrollMouseWheelTool.toolName as string);

function Viewer() {
  const { logout } = useAuth();

  const columnsInput = useNumberInput({ min: 1, defaultValue: 1 });
  const rowsInput = useNumberInput({ min: 1, defaultValue: 1 });

  return (
    <DarkMode>
      <Box p={4} bgColor="gray.800" h="100vh" w="full" overflow="hidden">
        <HStack>
          <Button onClick={logout} colorScheme="red">
            Cerrar sesión
          </Button>
          <HStack p={0.5} mx={0.5}>
            <Text color="white">Columnas:</Text>
            <Button {...columnsInput.getDecrementButtonProps()}> - </Button>
            <Input {...columnsInput.getInputProps()} color="white" />
            <Button {...columnsInput.getIncrementButtonProps()}> + </Button>
          </HStack>
          <HStack p={0.5} mx={0.5}>
            <Text color="white">Filas:</Text>
            <Button {...rowsInput.getDecrementButtonProps()}> - </Button>
            <Input {...rowsInput.getInputProps()} color="white" />
            <Button {...rowsInput.getIncrementButtonProps()}> + </Button>
          </HStack>
        </HStack>

        <PanelGroup
          columns={columnsInput.valueAsNumber}
          rows={rowsInput.valueAsNumber}
          toolGroup={toolGroup}
        />
      </Box>
    </DarkMode>
  );
}

export default Viewer;
