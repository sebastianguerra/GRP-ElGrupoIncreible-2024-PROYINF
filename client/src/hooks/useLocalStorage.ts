import { useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';

interface IUseLocalStorageOptions<T> {
  encode?: (value: T) => string;
  decode?: (value: string) => T;
  sync?: boolean;
}

type ValueOrFn<T> = T | ((prev: T) => T);
type SetLocalStorageValue<T> = (valueOrFn: ValueOrFn<T>) => void;

function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: IUseLocalStorageOptions<T> = {},
): [T, SetLocalStorageValue<T>] {
  const {
    encode = JSON.stringify as (value: T) => string,
    decode = JSON.parse as (value: string) => T,
    sync = true,
  } = options;

  const decodeOrDefault = useCallback(
    (value: string | null) => {
      if (value) return decode(value);
      return defaultValue;
    },
    [decode, defaultValue],
  );

  const [localStorageValue, setLocalStorageValue] = useState<T>(() =>
    decodeOrDefault(localStorage.getItem(key)),
  );

  useEffect(() => {
    localStorage.setItem(key, encode(localStorageValue));
  }, [key, localStorageValue, encode]);

  const setLocalStorageStateValue = useCallback(
    (valueOrFn: ValueOrFn<T>) => {
      const newValue = valueOrFn instanceof Function ? valueOrFn(localStorageValue) : valueOrFn;
      if (!isEqual(localStorageValue, newValue)) setLocalStorageValue(newValue);
    },
    [localStorageValue],
  );

  useEffect(() => {
    if (!sync) return () => {};

    const update = (event: StorageEvent) => {
      if (event.key === key) setLocalStorageStateValue(decodeOrDefault(event.newValue));
    };

    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('storage', update);
    };
  }, [sync, key, decodeOrDefault, setLocalStorageStateValue]);

  return [localStorageValue, setLocalStorageStateValue];
}

export default useLocalStorage;
