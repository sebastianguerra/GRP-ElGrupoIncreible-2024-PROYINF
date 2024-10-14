import { Box, HStack } from '@chakra-ui/react';
import * as cornerstone from '@cornerstonejs/core';
import { useEffect, useMemo, useRef } from 'react';

import { renderingEngine, toolGroup } from '@/cornerstone';
import useNanoId, { useNanoIds } from '@/hooks/useNanoId';
import { ImageId } from '@/types/dicoms';

interface PanelProps {
  imageIds: ImageId[];
}

export default function MPRPanels({ imageIds }: PanelProps) {
  const viewportIds = useNanoIds(3);

  const [element1, element2, element3] = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];
  const refs = useMemo(() => [element1, element2, element3], [element1, element2, element3]);

  useEffect(() => {
    const orientations = [
      cornerstone.Enums.OrientationAxis.AXIAL,
      cornerstone.Enums.OrientationAxis.SAGITTAL,
      cornerstone.Enums.OrientationAxis.CORONAL,
    ];

    const viewportInput: cornerstone.Types.PublicViewportInput[] = [0, 1, 2].map((_, i) => {
      if (!refs[i].current) throw new Error('Ref not set');
      return {
        viewportId: viewportIds[i],
        element: refs[i].current,
        type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
        defaultOptions: { orientation: orientations[i] },
      };
    });
    renderingEngine.setViewports(viewportInput);
    viewportIds.forEach((viewportId) => {
      toolGroup.addViewport(viewportId, renderingEngine.id);
    });

    return () => {
      viewportIds.forEach((viewportId) => {
        toolGroup.removeViewports(renderingEngine.id, viewportId);
        renderingEngine.disableElement(viewportId);
      });
    };
  }, [viewportIds, refs]);

  const volumeId = `cornerstoneStreamingImageVolume: ${useNanoId()}`;

  useEffect(() => {
    void (async () => {
      if (!imageIds.length) return;

      const volume = (await cornerstone.volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      })) as { load: () => Promise<void> };

      await volume.load();

      await cornerstone.setVolumesForViewports(renderingEngine, [{ volumeId }], viewportIds);

      renderingEngine.renderViewports(viewportIds);
    })();
  }, [imageIds, volumeId, viewportIds]);

  return (
    <HStack w="full" h="full" gap={1}>
      {refs.map((ref, i) => (
        <Box key={i} ref={ref} w="full" h="full" />
      ))}
    </HStack>
  );
}
