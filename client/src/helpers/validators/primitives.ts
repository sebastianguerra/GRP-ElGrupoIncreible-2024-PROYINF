export function asString(e: unknown, strict = false): string {
  if (typeof e === 'string') return e;
  if (strict) throw new Error('Invalid string');
  return String(e);
}
