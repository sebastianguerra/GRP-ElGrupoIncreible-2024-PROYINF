import { hasProperty } from '@/helpers/objects';
import { ImageId } from '@/types/dicoms';

export function hasValidImageId(instance: unknown): instance is { imageId: ImageId } {
  return hasProperty(instance, 'imageId') && typeof instance.imageId === 'string';
}

export function hasValidSliceLocation(instance: unknown): instance is { SliceLocation: number } {
  return hasProperty(instance, 'SliceLocation') && typeof instance.SliceLocation === 'number';
}

export function isValidInstance(
  instance: unknown,
): instance is { imageId: ImageId; SliceLocation: number } {
  if (!hasValidImageId(instance)) {
    return false;
  }
  if (!hasValidSliceLocation(instance)) {
    return false;
  }
  return true;
}
