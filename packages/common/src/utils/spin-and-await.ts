export async function spinAndAwait<T>(
  promise: Promise<T>,
  message: string,
): Promise<T> {
  const cliSpinners = await import('cli-spinners').then((m) => m.default);
  const spinner = cliSpinners.dots;
  let i = 0;

  const interval = setInterval(() => {
    i = ++i % spinner.frames.length;
    process.stdout.write(`\r${spinner.frames[i]} ${message}`);
  }, spinner.interval);

  try {
    return await promise;
  } finally {
    clearInterval(interval);
    process.stdout.write(`\r${' '.repeat(spinner.frames[i].length)}\r`);
  }
}
