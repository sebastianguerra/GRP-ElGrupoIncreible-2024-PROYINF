import { Box, BoxProps } from '@chakra-ui/react';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

interface DropInputProps extends Omit<BoxProps, 'onDrop'> {
  onDragOverColor?: string;
  borderColor?: string;
  onDrop: (files: FileList) => void;
}

const DropInput = React.forwardRef(function DropInput(
  props: DropInputProps,
  forwardedRef: React.Ref<HTMLDivElement | null>,
) {
  const { children, onDrop, onDragOverColor, borderColor: propsBorderColor, ...rest } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current);

  const element: HTMLDivElement | null = ref.current;

  const [isDragOver, setIsDragOver] = useState(false);
  const [borderColor, setBorderColor] = useState(propsBorderColor);

  useEffect(() => {
    setBorderColor(isDragOver ? onDragOverColor : propsBorderColor);
  }, [propsBorderColor, onDragOverColor, isDragOver]);

  useEffect(() => {
    if (element) {
      element.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      });

      element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
      });

      element.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (e.dataTransfer?.files) {
          onDrop(e.dataTransfer.files);
        }
      });
    }

    return () => {
      if (element) {
        element.removeEventListener('dragover', () => {});
        element.removeEventListener('dragleave', () => {});
        element.removeEventListener('drop', () => {});
      }
    };
  }, [element, onDrop]);

  return (
    <Box ref={ref} borderWidth="3px" borderStyle="solid" {...rest} borderColor={borderColor}>
      {children}
    </Box>
  );
});

export default DropInput;
