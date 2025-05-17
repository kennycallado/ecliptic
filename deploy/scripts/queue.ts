export async function queueing<T = unknown>(
  kv: Deno.Kv,
): Promise<{ error: Error | undefined; data: boolean }> {
  const { error, data } = await acquireLock(kv, ["cron-leader"], 60);
  if (error) {
    console.error("Error acquiring lock:", error);
    return { error, data: false };
  }

  if (data) {
    Deno.cron("singleton-task", "* * * * *", async () => {
      console.log("Running once, not on all workers.");
      await kv.enqueue("my-queue");
    });
  }

  try {
    kv.listenQueue((msg: T) => {
      console.log("Processing message:", msg);
    });
  } catch (error) {
    return { error: new Error(`Queue error: ${error}`), data: false };
  }

  return { error: undefined, data: true };
}

async function acquireLock(
  kv: Deno.Kv,
  key: string[],
  ttlSeconds: number,
): Promise<{ error: Error | undefined; data: boolean }> {
  const res = await kv.atomic()
    .check({ key, versionstamp: null }) // `null` versionstamps mean 'no value'
    .set(key, "locked", { expireIn: ttlSeconds * 1000 })
    .commit();

  if (res.ok) {
    return { error: undefined, data: true };
  } else {
    return { error: undefined, data: false };
  }
}
