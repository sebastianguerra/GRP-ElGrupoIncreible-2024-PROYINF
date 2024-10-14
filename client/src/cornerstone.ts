import * as cornerstone from '@cornerstonejs/core';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';
import { cornerstoneStreamingImageVolumeLoader } from '@cornerstonejs/streaming-image-volume-loader';
import * as cornerstoneTools from '@cornerstonejs/tools';
import dicomParser from 'dicom-parser';

await cornerstone.init();

dicomImageLoader.external.cornerstone = cornerstone;
dicomImageLoader.external.dicomParser = dicomParser;

cornerstone.volumeLoader.registerUnknownVolumeLoader(
  cornerstoneStreamingImageVolumeLoader as unknown as cornerstone.Types.VolumeLoaderFn,
);
cornerstone.volumeLoader.registerVolumeLoader(
  'cornerstoneStreamingImageVolume',
  cornerstoneStreamingImageVolumeLoader as unknown as cornerstone.Types.VolumeLoaderFn,
);

cornerstoneTools.init({});

try {
  // Adds the cornerstone and cornerstoneTools objects to the window object for debugging purposes
  (window as unknown as { cornerstone: typeof cornerstone }).cornerstone = { ...cornerstone };
  (window as unknown as { cornerstoneTools: typeof cornerstoneTools }).cornerstoneTools = {
    ...cornerstoneTools,
  };
} finally {
  // Pass
}

const { StackScrollMouseWheelTool, WindowLevelTool, ToolGroupManager, addTool, Enums } =
  cornerstoneTools;

addTool(StackScrollMouseWheelTool);
addTool(WindowLevelTool);

const maybeToolGroup = ToolGroupManager.createToolGroup('toolGroupId');
if (!maybeToolGroup) {
  throw new Error('Tool group not created');
}
export const toolGroup = maybeToolGroup;

toolGroup.addTool(StackScrollMouseWheelTool.toolName as string);
toolGroup.addTool(WindowLevelTool.toolName as string);

toolGroup.setToolActive(StackScrollMouseWheelTool.toolName as string);
toolGroup.setToolActive(WindowLevelTool.toolName as string, {
  bindings: [
    {
      mouseButton: Enums.MouseBindings.Primary,
    },
  ],
});

export const renderingEngineId = 'myRenderingEngine';
export const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);
