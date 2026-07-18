import { useEffect, useMemo, useState } from 'react';
import { RoomEvent } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';

const textDecoder = new TextDecoder();

export type Deal = {
  title: string;
  url?: string | null;
  source?: string | null;
  price?: number | null;
  priceText?: string | null;
  snippet?: string | null;
};

export type DealResultEvent = {
  id: string;
  query: string;
  country: string;
  count: number;
  deals: Deal[];
  /** Timestamp in milliseconds since epoch */
  timestamp: number;
};

const MAX_EVENTS_DEFAULT = 6;

function parsePayload(payload: Uint8Array): DealResultEvent | null {
  try {
    const raw = textDecoder.decode(payload);
    const message = JSON.parse(raw);
    if (!message || message.type !== 'deal_result' || typeof message.data !== 'object') {
      return null;
    }

    const data = message.data as Record<string, unknown>;
    const query = typeof data.query === 'string' ? data.query : '';
    if (!query) {
      return null;
    }

    const country = typeof data.country === 'string' ? data.country : 'us';
    const dealsInput = Array.isArray(data.deals) ? data.deals : [];
    const deals: Deal[] = dealsInput
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const d = item as Record<string, unknown>;
        return {
          title: typeof d.title === 'string' ? d.title : 'Listing',
          url: typeof d.url === 'string' ? d.url : null,
          source: typeof d.source === 'string' ? d.source : null,
          price: typeof d.price === 'number' ? d.price : null,
          priceText: typeof d.price_text === 'string' ? d.price_text : null,
          snippet: typeof d.snippet === 'string' ? d.snippet : null,
        };
      });

    const timestampMs = Date.now();

    return {
      id: `${timestampMs}-${query}`,
      query,
      country,
      count: typeof data.count === 'number' ? data.count : deals.length,
      deals,
      timestamp: timestampMs,
    };
  } catch (error) {
    console.warn('Failed to parse deal_result payload', error);
    return null;
  }
}

/**
 * Subscribes to the agent's `deal_result` data messages and returns the most
 * recent price-ranked deal results. The Deal Hunter agent publishes these
 * (reliable, JSON->bytes) whenever it runs `find_deals`, so the UI can show the
 * ranked listings live during a voice call.
 *
 * Must be used within a RoomContext (provided by the session provider).
 */
export function useDealResultEvents(maxEvents = MAX_EVENTS_DEFAULT) {
  const room = useRoomContext();
  const [events, setEvents] = useState<DealResultEvent[]>([]);

  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array) => {
      const parsed = parsePayload(payload);
      if (!parsed) return;

      setEvents((prev) => {
        const next = [...prev, parsed];
        if (maxEvents > 0 && next.length > maxEvents) {
          return next.slice(-maxEvents);
        }
        return next;
      });
    };

    room.on(RoomEvent.DataReceived, handleData);

    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, maxEvents]);

  return useMemo(() => events, [events]);
}
