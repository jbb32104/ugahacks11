import { useCallback, useState } from 'react';

export type UseTimedQueueOptions = {
  queueBase: string;
  getAccessToken?: () => Promise<string | null>;
  // add other existing options here if you have them
};

export default function useTimedQueue(opts: UseTimedQueueOptions) {
  const { queueBase, getAccessToken } = opts;
  const [loading, setLoading] = useState(false);

  const withAuth = useCallback(
    async (init: RequestInit = {}) => {
      const headers = new Headers(init.headers || {});
      if (getAccessToken) {
        const token = await getAccessToken();
        if (token) headers.set('Authorization', `Bearer ${token}`);
      }
      return { ...init, headers };
    },
    [getAccessToken]
  );

  const post = useCallback(
    async (path: string, body?: any) => {
      setLoading(true);
      try {
        const init = await withAuth({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : undefined,
        });
        const res = await fetch(`${queueBase}${path}`, init);
        if (!res.ok) throw new Error((await res.json())?.message ?? res.statusText);
        return await res.json();
      } finally {
        setLoading(false);
      }
    },
    [queueBase, withAuth]
  );

  const enqueue = useCallback((payload?: any) => post('/enqueue', payload), [post]);
  const status = useCallback(() => post('/status'), [post]);
  const leave = useCallback(() => post('/leave'), [post]);

  return { enqueue, status, leave, loading };
}