import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

import DicomMetadataStore from '@/helpers/DicomMetadataStore/DicomMetadataStore';

function DicomHeaderPopover() {
  const [finalText, setFinalText] = useState('');

  useEffect(() => {
    function updateText() {
      const study = DicomMetadataStore.getStudy(DicomMetadataStore.getStudyInstanceUIDs()[0]);
      const firstSeries = study?.series[0];
      const firstInstance = firstSeries?.instances[0];

      let text = '';
      if (!study) {
        text = 'Tienes que seleccionar un archivo DICOM para ver más información.';
      } else {
        const patientName: string = study.PatientName ?? 'Desconocido';
        text += `Nombre del paciente: ${patientName}\n`;

        const patientID = study.PatientID ?? 'Desconocido';
        text += `ID del paciente: ${patientID}\n`;

        const instanceNumber = firstInstance?.InstanceNumber ?? 'Desconocido';
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
    <Popover trigger="hover">
      <PopoverTrigger>
        <IconButton icon={<FiInfo />} aria-label="Más información" />
      </PopoverTrigger>
      <PopoverContent bgColor="gray.100">
        <PopoverBody>
          {finalText.split('\n').map((line, index) => (
            <Text key={index}>{line}</Text>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default DicomHeaderPopover;
