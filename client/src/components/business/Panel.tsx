import { Box, BoxProps } from '@chakra-ui/react';
import cornerstone from 'cornerstone-core';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useWindowSize } from '@/hooks/useWindowSize';

interface PanelProps extends BoxProps {
  imageIds: string[];
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { imageIds, ...rest },
  outerRef,
) {
  const panelRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(outerRef, () => panelRef.current!, [panelRef]);

  const [panel, setPanel] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setPanel(panelRef.current);
  }, [panelRef]);

  useEffect(() => {
    if (panel) {
      console.log('enable');
      cornerstone.enable(panel);
    }
    return () => {
      if (panel) cornerstone.disable(panel);
    };
  }, [panel]);

  const [windowX, windowY] = useWindowSize();

  useEffect(() => {
    if (panel) {
      cornerstone.resize(panel);
    }
  }, [panel, windowX, windowY, panel?.clientWidth, panel?.clientHeight]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (currentImageIndex >= imageIds.length) {
      setCurrentImageIndex(imageIds.length);
    } else if (currentImageIndex < 0) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, imageIds.length]);

  useEffect(() => {
    void (async () => {
      if (panel && imageIds.length && imageIds[currentImageIndex]) {
        const image = await cornerstone.loadImage(imageIds[currentImageIndex]);
        cornerstone.displayImage(panel, image);
      }
    })();
  }, [panel, imageIds, currentImageIndex]);

  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      setCurrentImageIndex((prev) => prev - 1);
    }
  }, []);

  useEffect(() => {
    if (panel) {
      panel.addEventListener('wheel', handleScroll);
    }
    return () => {
      if (panel) {
        panel.removeEventListener('wheel', handleScroll);
      }
    };
  }, [panel, handleScroll]);

  return <Box {...rest} ref={panelRef} />;
});

export default Panel;
