export function isObject(e: unknown): e is Record<string, unknown> {
  return !!e && typeof e === 'object';
}

export function hasProperty<K extends string>(e: unknown, k: K): e is { [key in K]: unknown } {
  return isObject(e) && k in e;
}

export function hasProperties<K extends string[]>(
  e: unknown,
  ...k: K
): e is { [key in K[number]]: unknown } {
  return k.every((key) => hasProperty(e, key));
}
