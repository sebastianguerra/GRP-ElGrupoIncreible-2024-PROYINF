import { Box, BoxProps } from '@chakra-ui/react';
import { Enums, Types } from '@cornerstonejs/core';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { renderingEngine, renderingEngineId, toolGroup } from '@/cornerstone';
import useNanoId from '@/hooks/useNanoId';
import { useWindowSize } from '@/hooks/useWindowSize';
import { ImageId } from '@/types/dicoms';

interface PanelProps extends BoxProps {
  imageIds: ImageId[];
}

const Panel = forwardRef(function Panel(
  { imageIds, ...rest }: PanelProps,
  outerRef: React.Ref<HTMLDivElement | null>,
) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(outerRef, () => panelRef.current);

  const viewportId = useNanoId();

  useEffect(() => {
    if (panelRef.current) {
      const viewportInput: Types.PublicViewportInput = {
        viewportId: viewportId,
        type: Enums.ViewportType.STACK,
        element: panelRef.current,
        defaultOptions: {
          background: [0, 0, 0],
        },
      };

      renderingEngine.enableElement(viewportInput);
      toolGroup.addViewport(viewportId, renderingEngineId);
    }

    return () => {
      toolGroup.removeViewports(renderingEngineId, viewportId);
      renderingEngine.disableElement(viewportId);
    };
  }, [panelRef, viewportId]);

  useEffect(() => {
    const viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport | undefined;
    if (viewport && imageIds.length > 0) {
      viewport.setStack(imageIds).then(() => {
      renderingEngine.renderViewports([viewportId]);
      });
    }
  }, [viewportId, imageIds]);

  const [windowX, windowY] = useWindowSize();
  useEffect(() => {
    renderingEngine.resize(true, false);
  }, [panelRef, windowX, windowY]);

  return <Box {...rest} ref={panelRef} />;
});

export default Panel;
