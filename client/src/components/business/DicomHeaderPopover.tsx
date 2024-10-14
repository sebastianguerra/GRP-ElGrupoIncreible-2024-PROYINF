import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

import { renderingEngine } from '@/cornerstone';
import { getMetadata } from '@/helpers/dicoms';
import { asString } from '@/helpers/validators/primitives';
import { ImageId } from '@/types/dicoms';

interface RowData {
  key: string;
  value: string;
}

function DicomHeaderPopover() {
  const [finalData, setFinalData] = useState<RowData[]>([]);
  const [currentImageId, setCurrentImageId] = useState<ImageId | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImageId(renderingEngine.getStackViewports()[0].getCurrentImageId() as ImageId);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!currentImageId) return;

    const sources = {
      patientModule: () => getMetadata(currentImageId, 'patientModule') as Record<string, unknown>,
      generalStudyModule: () =>
        getMetadata(currentImageId, 'generalStudyModule') as Record<string, unknown>,
    } as const;

    type SourcesKeys = keyof typeof sources;
    type Cache = Record<SourcesKeys, ReturnType<(typeof sources)[SourcesKeys]>>;
    const cache: Partial<Cache> = {};

    function rowBuilder<T extends SourcesKeys, S = Cache[T]>({
      sourceKey,
      preprocess = (data) => data as S,
      label,
      parse,
    }: {
      sourceKey: T;
      preprocess?: (data: Cache[T]) => S;
      label: string | ((data: S) => string);
      parse: (data: S) => string;
    }): RowData {
      let sourceData: Cache[T] | undefined = cache[sourceKey];
      if (!sourceData) cache[sourceKey] = sourceData = sources[sourceKey]();

      const data = preprocess(sourceData);
      const parsedLabel: string = typeof label === 'function' ? label(data) : label;

      return {
        key: parsedLabel,
        value: parse(data),
      };
    }

    setFinalData([
      rowBuilder({
        sourceKey: 'patientModule',
        label: 'Nombre del paciente',
        parse: (data) => asString(data.patientName),
      }),
      rowBuilder({
        sourceKey: 'patientModule',
        label: 'ID del paciente',
        parse: (data) => asString(data.patientID),
      }),
      rowBuilder({
        sourceKey: 'generalStudyModule',
        label: 'Número de acceso',
        parse: (data) => asString(data.accessionNumber),
      }),
      rowBuilder({
        sourceKey: 'generalStudyModule',
        label: 'Descripción del estudio',
        parse: (data) => asString(data.studyDescription),
      }),
      rowBuilder({
        sourceKey: 'generalStudyModule',
        preprocess: (data) =>
          [
            {
              label: 'Fecha',
              data: data.studyDate as Record<string, number>,
              value: (d: Record<string, number>) => `${d.day}/${d.month}/${d.year}`,
            },
            {
              label: 'Hora',
              data: data.studyTime as Record<string, number>,
              value: (d: Record<string, number>) => `${d.hours}:${d.minutes}:${d.seconds}`,
            },
          ].filter((d) => !!(d.data as Record<string, number> | undefined)),
        label: (data) => `${data.map((d) => d.label).join(' y ')} del estudio`,
        parse: (data) => data.map((d) => d.value(d.data)).join(' - '),
      }),
    ]);
  }, [currentImageId]);

  return (
    <Popover placement="right-end">
      <PopoverTrigger>
        <IconButton icon={<FiInfo />} aria-label="Más información" />
      </PopoverTrigger>
      <PopoverContent bgColor="gray.100" w="max-content">
        <PopoverBody>
          {finalData.length === 0 ? (
            <Text>No hay información disponible</Text>
          ) : (
            <Table variant="unstyled" size="sm">
              <Tbody>
                {finalData.map((line, index) => (
                  <Tr key={index}>
                    <Td>
                      <Text>{line.key}</Text>
                    </Td>
                    <Td>
                      <Text>{line.value}</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default DicomHeaderPopover;
