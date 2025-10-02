export type Left<E> = { error: E };

export type Right<T> = { value: T };

export type Either<E, T> = Left<E> | Right<T>;

export function isError<E>(either: Either<E, unknown>): either is Left<E> {
    return 'error' in either;
}

export function isValue<V>(either: Either<unknown, V>): either is Right<V> {
    return 'value' in either;
}

