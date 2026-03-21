export const updateFetchAiHandle = async (link: string): Promise<void> => {
  const res = await fetch('/api/fetch-ai-handle', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fetchAiHandle: link }),
  });

  const text = await res.text();
  const data = (res.headers.get('content-type') || '').includes('application/json')
    ? text
      ? JSON.parse(text)
      : {}
    : { error: { message: 'Non-JSON response from server' } };

  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || data?.message || 'Invalid link');
  }
};
