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

function DicomHeaderPopover() {
  const [finalText, setFinalText] = useState('');

  useEffect(() => {
    function updateText() {
      let text = '';
      text = 'Tienes que seleccionar un archivo DICOM para ver más información.';
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
