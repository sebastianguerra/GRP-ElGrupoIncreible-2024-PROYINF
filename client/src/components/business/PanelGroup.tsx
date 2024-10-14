import { Grid, GridItem, HStack, IconButton, Tooltip, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiFile, FiFolder, FiUpload } from 'react-icons/fi';

import DropInput from '@/components/ui/DropInput';
import { Layout } from '@/components/ui/LayoutSelector';
import { addFiles } from '@/helpers/dicoms';
import { ImageId } from '@/types/dicoms';

import Panel from './Panel';

interface PanelGroupProps {
  layout: Layout;
}

function PanelGroup({ layout }: PanelGroupProps) {
  const [imageIds, setImageIds] = useState<ImageId[]>([]);

  const handleFileChange = async (files: File[]) => {
    setImageIds(await addFiles(files));
  };

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

  const [columns, rows] = layout;

  const [buttonsHover, setButtonsHover] = useState(false);

  return (
    <>
      <DropInput
        key={`${columns.toString()}x${rows.toString()}`}
        onDrop={(files) => void handleFileChange(Array.from(files))}
        borderColor="black"
        onDragOverColor="blue"
        h="full"
        w="full"
        as={HStack}
      >
        <Grid
          w="full"
          h="full"
          bgColor="black"
          templateColumns={`repeat(${columns.toString()}, 1fr)`}
          templateRows={`repeat(${rows.toString()}, 1fr)`}
          key={`${columns.toString()}x${rows.toString()}`}
        >
          {Array.from({ length: columns * rows }).map((_, i) => (
            <GridItem
              key={`panel-${i.toString()}-group-${columns.toString()}x${rows.toString()}`}
              w="full"
              h="full"
            >
              <Panel
                imageIds={imageIds}
                w="full"
                h="full"
                bgColor="darkgray"
                borderWidth="1px"
                borderStyle="solid"
                borderRadius="5px"
              />
            </GridItem>
          ))}
        </Grid>
      </DropInput>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => e.target.files && void handleFileChange(Array.from(e.target.files))}
        style={{ display: 'none' }}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        onChange={(e) => {
          console.log(e);
          console.log(e.target.files);
          if (e.target.files) {
            console.log(Array.from(e.target.files));
            void handleFileChange(Array.from(e.target.files));
          }
        }}
        style={{ display: 'none' }}
      />

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
                onClick={() => folderInputRef.current?.click()}
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
            icon={buttonsHover ? <FiFile /> : <FiUpload />}
            aria-label="Subir archivos"
            onClick={() => fileInputRef.current?.click()}
            colorScheme="cyan"
            transform={buttonsHover ? 'rotate(360deg)' : 'none'}
            transition="all 0.25s ease"
          />
        </Tooltip>
      </VStack>
    </>
  );
}

export default PanelGroup;
