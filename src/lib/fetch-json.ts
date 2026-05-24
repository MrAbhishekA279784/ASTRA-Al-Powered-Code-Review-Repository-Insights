export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
  }
}

export async function fetchJson(url: string, options?: RequestInit): Promise<any> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    console.error('[ASTRA API ERROR] Network failure:', url, err.message);
    throw new FetchError('Network error: unable to reach server', 0);
  }

  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('[ASTRA API ERROR] Non-JSON response:', {
      url,
      status: res.status,
      contentType,
      preview: text.substring(0, 300),
    });
    throw new FetchError(
      `Server returned unexpected response (${res.status}). Please try again.`,
      res.status
    );
  }

  const data = await res.json();

  if (!res.ok) {
    console.error('[ASTRA API ERROR] Request failed:', {
      url,
      status: res.status,
      error: data.error,
    });
    throw new FetchError(data.error || `Request failed (${res.status})`, res.status);
  }

  return data;
}
