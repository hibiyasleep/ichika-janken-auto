export function pick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export async function retryUntilSuccess<T>(fn: () => Promise<T>, retryCount: number = 3): Promise<T> {
    let _err: Error;
    for (let i = 0; i < retryCount; ++i) {
        try {
            return await fn();
        } catch (err) {
            _err = err;
        }
    }
    throw _err!;
}
