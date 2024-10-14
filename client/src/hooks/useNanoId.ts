import { useConst } from '@chakra-ui/react';
import { nanoid } from 'nanoid';

export default () => useConst(() => nanoid());

export function useNanoIds(count: number) {
  const original = useConst(count);

  if (original !== count) throw new Error('Count must be constant');

  return useConst(() => Array.from({ length: count }).map(() => nanoid()));
}
