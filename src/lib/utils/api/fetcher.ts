export default async function Fetcher<T = any>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const res = await fetch(...args);

  return res.json();
}
