import { Box, BoxProps, IconButton, Tooltip, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FiFile, FiFolder, FiUpload } from 'react-icons/fi';

interface DropInputProps extends Omit<BoxProps, 'onDrop'> {
  onDragOverColor?: string;
  borderColor?: string;
  onDrop: (files: FileList) => void;
}

const DropInput = React.forwardRef(function DropInput(
  props: DropInputProps,
  forwardedRef: React.Ref<HTMLDivElement | null>,
) {
  const {
    children,
    onDrop: onDropProp,
    onDragOverColor,
    borderColor: propsBorderColor,
    ...rest
  } = props;

  const onDrop = useCallback(
    (files: FileList | undefined | null) => {
      if (files) onDropProp(files);
    },
    [onDropProp],
  );

  const dropInputRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(forwardedRef, () => dropInputRef.current);

  const [isDragOver, setIsDragOver] = useState(false);
  const [borderColor, setBorderColor] = useState(propsBorderColor);

  useEffect(() => {
    setBorderColor(isDragOver ? onDragOverColor : propsBorderColor);
  }, [propsBorderColor, onDragOverColor, isDragOver]);

  useEffect(() => {
    const element = dropInputRef.current;
    if (!element) return () => {};

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

      onDrop(e.dataTransfer?.files);
    });

    return () => {
      element.removeEventListener('dragover', () => {});
      element.removeEventListener('dragleave', () => {});
      element.removeEventListener('drop', () => {});
    };
  }, [dropInputRef, onDrop]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const folderInputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (folderInputRef.current) {
      // Adds the ability to select folders in the file input
      folderInputRef.current.setAttribute('directory', '');
      folderInputRef.current.setAttribute('webkitdirectory', '');
      folderInputRef.current.setAttribute('mozdirectory', '');
    }
  }, [folderInputRef]);

  const clickInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    return inputRef.current?.click();
  };
  const [buttonsHover, setButtonsHover] = useState(false);

  return (
    <>
      <Box
        ref={dropInputRef}
        borderWidth="3px"
        borderStyle="solid"
        {...rest}
        borderColor={borderColor}
      >
        {children}
      </Box>
      {[fileInputRef, folderInputRef].map((inputRef, i) => (
        <input
          key={`panel-group-input-${i}`}
          ref={inputRef}
          type="file"
          multiple
          onChange={(e) => {
            onDrop(e.target.files);
          }}
          style={{ display: 'none' }}
        />
      ))}

      <VStack
        position="absolute"
        bottom="30px"
        right="30px"
        onMouseEnter={() => {
          setTimeout(() => {
            setButtonsHover(true);
          }, 100);
        }}
        onMouseLeave={() => {
          setTimeout(() => {
            setButtonsHover(false);
          }, 200);
        }}
      >
        <AnimatePresence>
          {buttonsHover && (
            <Tooltip
              label="Subir carpeta"
              aria-label="Subir carpeta"
              hasArrow
              placement="left"
              shouldWrapChildren
            >
              <IconButton
                key="panel-group-folder-input"
                borderRadius="full"
                icon={<FiFolder />}
                aria-label="Subir archivos"
                onClick={() => clickInput(folderInputRef)}
                colorScheme="cyan"
                as={motion.button}
                initial={{ translateY: '40px', opacity: 0 }}
                animate={{ translateY: '0', opacity: 1 }}
                exit={{ translateY: '40px', opacity: 0 }}
                transition="all 0.05s ease"
              />
            </Tooltip>
          )}
        </AnimatePresence>
        <Tooltip
          label="Subir archivos"
          aria-label="Subir archivos"
          hasArrow
          placement="left"
          shouldWrapChildren
        >
          <IconButton
            borderRadius="full"
            aria-label="Subir archivos"
            onClick={() => clickInput(fileInputRef)}
            colorScheme="cyan"
            transition="all 0.25s ease"
            {...(buttonsHover
              ? { icon: <FiFile />, transform: 'rotate(360deg)' }
              : { icon: <FiUpload />, transform: 'none' })}
          />
        </Tooltip>
      </VStack>
    </>
  );
});

export default DropInput;
