import { useEffect, useState } from 'react';
import { RoomEvent } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';

const textDecoder = new TextDecoder();

export type Watch = {
  product: string;
  targetPrice: number | null;
  /** Live cheapest price found on the last refresh, if any */
  currentPrice: number | null;
  currentSource: string | null;
  currentUrl: string | null;
};

function parsePayload(payload: Uint8Array): Watch[] | null {
  try {
    const raw = textDecoder.decode(payload);
    const message = JSON.parse(raw);
    if (!message || message.type !== 'watchlist' || typeof message.data !== 'object') {
      return null;
    }

    const data = message.data as Record<string, unknown>;
    const list = Array.isArray(data.watches) ? data.watches : [];

    return list
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const w = item as Record<string, unknown>;
        return {
          product: typeof w.product === 'string' ? w.product : 'Item',
          targetPrice: typeof w.target_price === 'number' ? w.target_price : null,
          currentPrice: typeof w.current_price === 'number' ? w.current_price : null,
          currentSource: typeof w.current_source === 'string' ? w.current_source : null,
          currentUrl: typeof w.current_url === 'string' ? w.current_url : null,
        };
      })
      .filter((w) => w.product.trim().length > 0);
  } catch (error) {
    console.warn('Failed to parse watchlist payload', error);
    return null;
  }
}

/**
 * Subscribes to the agent's `watchlist` data messages and returns the user's
 * current price watchlist. The agent publishes the full list whenever it
 * changes (on `watch_item`) or is requested (`list_watches`), so this replaces
 * state rather than accumulating events.
 *
 * Must be used within a RoomContext (provided by the session provider).
 */
export function useWatchlistEvents() {
  const room = useRoomContext();
  const [watches, setWatches] = useState<Watch[] | null>(null);

  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array) => {
      const parsed = parsePayload(payload);
      if (!parsed) return;
      setWatches(parsed);
    };

    room.on(RoomEvent.DataReceived, handleData);

    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room]);

  return watches;
}
