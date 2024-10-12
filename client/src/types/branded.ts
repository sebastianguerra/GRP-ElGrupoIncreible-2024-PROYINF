// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __brand: unique symbol;

export type Branded<T, Brand> = T & { [__brand]: Brand };
