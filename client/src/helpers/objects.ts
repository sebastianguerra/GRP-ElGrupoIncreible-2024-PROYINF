export function hasProperty<K extends string>(e: unknown, k: K): e is { [key in K]: unknown } {
  if (!e || typeof e !== 'object') return false;
  if (!(k in e)) return false;

  return true;
}
