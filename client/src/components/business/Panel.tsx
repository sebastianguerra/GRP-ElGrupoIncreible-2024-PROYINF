import { Box, BoxProps } from '@chakra-ui/react';
import { Enums, getRenderingEngine, RenderingEngine, Types } from '@cornerstonejs/core';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { toolGroup } from '@/cornerstone';
import { useWindowSize } from '@/hooks/useWindowSize';

interface PanelProps extends BoxProps {
  imageIds: string[];
}

const renderingEngineId = 'myRenderingEngine';
let renderingEngine: Types.IRenderingEngine | undefined;

const Panel = forwardRef(function Panel(
  { imageIds, ...rest }: PanelProps,
  outerRef: React.Ref<HTMLDivElement | null>,
) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(outerRef, () => panelRef.current);

  const panel = panelRef.current;

  const [windowX, windowY] = useWindowSize();

  useEffect(() => {
    if (panel) {
      const viewportInput: Types.PublicViewportInput = {
        viewportId: 'default',
        type: Enums.ViewportType.STACK,
        element: panel,
        defaultOptions: {
          background: [0, 0, 0],
        },
      };

      renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine || renderingEngine.hasBeenDestroyed) {
        renderingEngine = new RenderingEngine(renderingEngineId);
      }

      renderingEngine.enableElement(viewportInput);

      const viewport = renderingEngine.getViewport(
        viewportInput.viewportId,
      ) as Types.IStackViewport;
      void viewport.setStack(imageIds).then(() => {
        renderingEngine?.renderViewports([viewportInput.viewportId]);
      });

      toolGroup?.addViewport(viewportInput.viewportId, renderingEngineId);
    }
  }, [panel, imageIds]);

  useEffect(() => {
    if (panel) {
      renderingEngine?.resize(true, false);
    }
  }, [panel, windowX, windowY, panel?.clientWidth, panel?.clientHeight]);

  return <Box {...rest} ref={panelRef} />;
});

export default Panel;
