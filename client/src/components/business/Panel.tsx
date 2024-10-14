import { Box, BoxProps, useConst } from '@chakra-ui/react';
import { Enums, Types } from '@cornerstonejs/core';
import { nanoid } from 'nanoid';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

import { renderingEngine, renderingEngineId, toolGroup } from '@/cornerstone';
import { getInstance } from '@/helpers/dicoms';
import { useWindowSize } from '@/hooks/useWindowSize';
import { ImageId } from '@/types/dicoms';

interface PanelProps extends BoxProps {
  imageIds: ImageId[];
}

const Panel = forwardRef(function Panel(
  { imageIds: _imageIds, ...rest }: PanelProps,
  outerRef: React.Ref<HTMLDivElement | null>,
) {
  const imageIds = useMemo(
    () => _imageIds.toSorted((a, b) => getInstance(a).SliceLocation - getInstance(b).SliceLocation),
    [_imageIds],
  );

  const panelRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(outerRef, () => panelRef.current);

  const [windowX, windowY] = useWindowSize();

  const viewportId = useConst(() => nanoid());

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
      void viewport.setStack(imageIds).then(() => {
        renderingEngine.renderViewports([viewportId]);
      });
    }
  }, [viewportId, imageIds]);

  useEffect(() => {
    renderingEngine.resize(true, false);
  }, [panelRef, windowX, windowY]);

  return <Box {...rest} ref={panelRef} />;
});

export default Panel;
