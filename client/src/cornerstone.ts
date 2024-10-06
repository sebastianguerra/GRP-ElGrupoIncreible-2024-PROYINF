import * as cornerstone from '@cornerstonejs/core';
import dicomImageLoader from '@cornerstonejs/dicom-image-loader';
import * as cornerstoneTools from '@cornerstonejs/tools';
import dicomParser from 'dicom-parser';

await cornerstone.init();
cornerstoneTools.init({});

dicomImageLoader.external.cornerstone = cornerstone;
dicomImageLoader.external.dicomParser = dicomParser;

const { StackScrollMouseWheelTool, ToolGroupManager } = cornerstoneTools;

cornerstoneTools.addTool(StackScrollMouseWheelTool);

export const toolGroup = ToolGroupManager.createToolGroup('toolGroupId');

toolGroup?.addTool(StackScrollMouseWheelTool.toolName as string);
toolGroup?.setToolActive(StackScrollMouseWheelTool.toolName as string);
