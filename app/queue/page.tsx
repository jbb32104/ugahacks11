'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useTimedQueue from '../../utils/supabase/timedQueue';
import { getSessionToken } from '../../utils/supabase/supabaseauth';

const QUEUE_BASE =
  'https://ohusvtslerupgtmporsr.supabase.co/functions/v1/timed-queue';

export default function TimedQueuePage() {
  const router = useRouter();

  const { enqueue, status, leave, loading } = useTimedQueue({
    queueBase: QUEUE_BASE,
    getAccessToken: getSessionToken,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [statusPayload, setStatusPayload] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await status();
        if (!mounted) return;
        setStatusPayload(res);
      } catch (err) {
        console.error('initial status error', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [status]);

  // Redirect when queue position reaches 1
  useEffect(() => {
    if (statusPayload?.position === 1) {
      router.push('/control');
    }
  }, [statusPayload, router]);

  const handleJoin = async () => {
    setMessage(null);
    try {
      const payload = { meta: 'joined_from_page', ts: new Date().toISOString() };
      const res = await enqueue(payload);
      setMessage('Joined queue');
      setStatusPayload(res);
    } catch (err: any) {
      setMessage(err?.message ?? 'Join failed');
    }
  };

  const handleStatus = async () => {
    setMessage(null);
    try {
      const res = await status();
      setStatusPayload(res);
      setMessage('Status fetched');
    } catch (err: any) {
      setMessage(err?.message ?? 'Status fetch failed');
    }
  };

  const handleLeave = async () => {
    setMessage(null);
    try {
      const res = await leave();
      setMessage('Left queue');
      setStatusPayload(res);
    } catch (err: any) {
      setMessage(err?.message ?? 'Leave failed');
    }
  };

  return (
    <div
      style={{
        padding: 20,
        color: '#999',
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <h1>Timed Queue</h1>

      <p>
        You should already be authenticated to view this page. These actions will
        send your session token to the queue endpoint so the server can identify
        you.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={handleJoin} disabled={loading}>
          {loading ? 'Working...' : 'Join Queue'}
        </button>
        <button onClick={handleStatus} disabled={loading}>
          Check Status
        </button>
        <button onClick={handleLeave} disabled={loading}>
          Leave Queue
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Message:</strong>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            background: '#f6f6f6',
            padding: 10,
            borderRadius: 6,
          }}
        >
          {message ?? '—'}
        </div>
      </div>

      <div>
        <strong>Latest Status:</strong>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            background: '#fafafa',
            padding: 10,
            borderRadius: 6,
          }}
        >
          {statusPayload
            ? JSON.stringify(statusPayload, null, 2)
            : 'No status yet'}
        </div>
      </div>
    </div>
  );
}
