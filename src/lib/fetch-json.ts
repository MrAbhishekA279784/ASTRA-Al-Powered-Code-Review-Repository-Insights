import { API_BASE_URL } from './api';

export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
  }
}

export async function fetchJson(url: string, options?: RequestInit): Promise<any> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  let res: Response;
  try {
    res = await fetch(fullUrl, options);
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    console.error('[ASTRA API ERROR] Network failure:', fullUrl, err.message);
    throw new FetchError('Network error: unable to reach server. Check your connection.', 0);
  }

  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    const preview = text.substring(0, 120);
    console.error('[ASTRA API ERROR] Non-JSON response:', {
      url: fullUrl,
      status: res.status,
      contentType,
      preview,
    });
    throw new FetchError(
      `Expected JSON but received: "${preview}"`,
      res.status
    );
  }

  const data = await res.json();

  if (!res.ok) {
    console.error('[ASTRA API ERROR] Request failed:', {
      url: fullUrl,
      status: res.status,
      error: data.error,
    });
    throw new FetchError(data.error || `Request failed (${res.status})`, res.status);
  }

  return data;
}
