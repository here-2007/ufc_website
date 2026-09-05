'use client';

import { useEffect, useState } from 'react';
import { Calendar, Check, Shield, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-provider';

interface PendingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  creator: { name: string | null; githubUsername: string | null };
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/admin/pending-events');
      const data = await response.json();
      setEvents(data.events || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !['ADMIN', 'MAINTAINER'].includes(user.role.toUpperCase())) {
      router.replace('/dashboard');
      return;
    }

    void loadEvents();
  }, [user, router]);

  const reviewEvent = async (eventId: string, action: 'approve' | 'reject') => {
    setProcessingId(eventId);
    try {
      const response = await fetch('/api/dashboard/admin/approve-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      });

      if (!response.ok) {
        throw new Error('Unable to review event');
      }

      await loadEvents();
    } catch (error) {
      console.error('Event review failed:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="rounded-xl border border-[#0B874F]/30 bg-gradient-to-r from-black/60 to-[#0B874F]/10 p-8">
        <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
          <Shield className="h-10 w-10 text-[#0B874F]" />
          Event Administration
        </h1>
        <p className="mt-2 text-gray-300">Review submitted events from maintainers.</p>
      </header>

      {loading ? (
        <p className="text-gray-400">Loading pending events…</p>
      ) : events.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-black/40 p-6 text-gray-400">No events are awaiting review.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <article key={event.id} className="rounded-lg border border-white/10 bg-black/40 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                  <p className="mt-2 max-w-3xl text-gray-300">{event.description}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleString()} · {event.location} · {event.type}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Submitted by {event.creator.name || event.creator.githubUsername || 'Unknown'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={processingId === event.id}
                    onClick={() => void reviewEvent(event.id, 'approve')}
                    className="flex items-center gap-2 rounded bg-[#0B874F] px-3 py-2 font-medium text-black disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    type="button"
                    disabled={processingId === event.id}
                    onClick={() => void reviewEvent(event.id, 'reject')}
                    className="flex items-center gap-2 rounded border border-red-500/60 px-3 py-2 text-red-300 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
