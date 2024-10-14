import { hasProperty } from '@/helpers/objects';
import { ImageId } from '@/types/dicoms';

export function hasValidSliceLocation(instance: unknown): instance is { SliceLocation: number } {
  return hasProperty(instance, 'SliceLocation') && typeof instance.SliceLocation === 'number';
}

export function isValidInstance(
  instance: unknown,
): instance is { imageId: ImageId; SliceLocation: number } {
  if (!hasValidSliceLocation(instance)) {
    return false;
  }
  return true;
}
