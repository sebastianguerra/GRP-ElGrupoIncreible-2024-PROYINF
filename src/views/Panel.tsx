import cornerstone from 'cornerstone-core';
import { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';

const Panel = forwardRef(function Panel(_, outerRef) {
  const panelRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(outerRef, () => panelRef.current, [panelRef]);

  const [panel, setPanel] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setPanel(panelRef.current);
  }, [panelRef]);

  useEffect(() => {
    if (panel) cornerstone.enable(panel);
    return () => {
      if (panel) cornerstone.disable(panel);
    };
  }, [panel]);

  return <div ref={panelRef} />;
});

export default Panel;
