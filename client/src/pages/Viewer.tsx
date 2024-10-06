import {
  Box,
  Button,
  DarkMode,
  HStack,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useNumberInput,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import PanelGroup from '@/components/business/PanelGroup';
import { useAuth } from '@/contexts/authContext';
import DicomMetadataStore from '@/helpers/DicomMetadataStore/DicomMetadataStore';

function Viewer() {
  const { logout } = useAuth();

  const columnsInput = useNumberInput({ min: 1, defaultValue: 1 });
  const rowsInput = useNumberInput({ min: 1, defaultValue: 1 });

  const [finalText, setFinalText] = useState('');

  useEffect(() => {
    function updateText() {
      const study = DicomMetadataStore.getStudy(DicomMetadataStore.getStudyInstanceUIDs()[0]);
      const firstSeries = study?.series[0];
      const firstInstance = firstSeries?.instances[0];
      console.log(firstInstance);

      let text = '';
      if (!study) {
        text = 'Tienes que seleccionar un archivo DICOM para ver más información.';
      } else {
        const patientName: string =
          study.PatientName ??
          firstSeries?.PatientName ??
          firstInstance?.PatientName ??
          'Desconocido';
        text += `Nombre del paciente: ${patientName}\n`;

        const patientID =
          study.PatientID ?? firstSeries?.PatientID ?? firstInstance?.PatientID ?? 'Desconocido';
        text += `ID del paciente: ${patientID}\n`;

        const instanceNumber =
          firstInstance?.InstanceNumber ?? firstSeries?.InstanceNumber ?? 'Desconocido';
        text += `Número de instancia: ${instanceNumber}\n`;
      }
      setFinalText(text);
    }
    const id = setInterval(updateText, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

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
          <Popover trigger="hover">
            <PopoverTrigger>
              <Text color="white">Más Información</Text>
            </PopoverTrigger>
            <PopoverContent bgColor="gray.100">
              <PopoverBody>
                {finalText.split('\n').map((line, index) => (
                  <Text key={index}>{line}</Text>
                ))}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>

        <PanelGroup columns={columnsInput.valueAsNumber} rows={rowsInput.valueAsNumber} />
      </Box>
    </DarkMode>
  );
}

export default Viewer;
