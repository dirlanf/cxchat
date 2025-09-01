const API_URL = import.meta.env.VITE_API_URL;

type FetchOptions = RequestInit & { json?: any; timeoutMs?: number };

export async function apiFetch<T>(
  path: string,
  opts: FetchOptions = {}
): Promise<T> {
  const { json, headers, timeoutMs = 15000, ...rest } = opts;

  const method = (
    rest.method ?? (json !== undefined ? "POST" : "GET")
  ).toUpperCase();

  const isFormData = rest.body instanceof FormData;
  const baseHeaders: Record<string, string> = {};
  if (json !== undefined && !isFormData)
    baseHeaders["Content-Type"] = "application/json";

  const init: RequestInit = {
    ...rest,
    method,
    credentials: "include",
    headers: { ...baseHeaders, ...(headers as any) },
    body: json !== undefined && !isFormData ? JSON.stringify(json) : rest.body,
    signal: rest.signal,
  };

  const ctrl = new AbortController();
  const signal = mergeSignals(init.signal, ctrl.signal);
  const timer = setTimeout(() => ctrl.abort("timeout"), timeoutMs);

  const url = `${API_URL}${path}`;
  try {
    const res = await fetch(url, { ...init, signal });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const err = await res.json();
        if (err?.message) message = err.message;
      } catch {}
      throw new Error(message);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

function mergeSignals(a?: AbortSignal | null, b?: AbortSignal | null) {
  if (!a) return b ?? undefined;
  if (!b) return a;
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  a.addEventListener("abort", onAbort);
  b.addEventListener("abort", onAbort);
  if (a.aborted || b.aborted) ctrl.abort();
  return ctrl.signal;
}
