export function isObject(e: unknown): e is Record<string, unknown> {
  return !!e && typeof e === 'object';
}

export function hasProperty<K extends string>(e: unknown, k: K): e is { [key in K]: unknown } {
  return isObject(e) && k in e;
}
