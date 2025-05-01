type Result<T, E> = { data: T; error?: undefined } | {
  data?: undefined;
  error: E;
};

interface CatchOptions<T, Ctor extends new (message?: string) => Error> {
  errorsToCatch?: Array<Ctor>;
  onError?: (error: InstanceType<Ctor>) => void;
  onSuccess?: (data: T) => void;
  retry?: () => Promise<T>;
}

export async function catchErrorTyped<
  T,
  Ctor extends new (message?: string) => Error,
>(
  input: { promise: Promise<T>; options?: CatchOptions<T, Ctor> } | Promise<T>,
): Promise<Result<T, InstanceType<Ctor>>> {
  if (isThenable<T>(input)) input = { promise: input, options: undefined };

  try {
    const data = await input.promise;
    input.options?.onSuccess?.(data);

    return { data };
  } catch (rawErr) {
    if (!(rawErr instanceof Error)) throw rawErr;
    const matches = !input.options?.errorsToCatch ||
      input.options.errorsToCatch.some((Ctor) => rawErr instanceof Ctor);

    if (matches) {
      const error = rawErr as InstanceType<Ctor>;
      input.options?.onError?.(error);

      if (input.options?.retry) {
        try {
          const data = await input.options.retry();
          input.options?.onSuccess?.(data);

          return { data };
        } catch (retryErr) {
          return { error: retryErr as InstanceType<Ctor> };
        }
      }

      return { error };
    }

    throw rawErr;
  }
}

function isThenable<T>(x: any): x is Promise<T> {
  return x != null && typeof x.then === "function";
}
