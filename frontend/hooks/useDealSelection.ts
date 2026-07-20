'use client';

import { useCallback, useRef } from 'react';
import { useAgent, useRoomContext } from '@livekit/components-react';
import type { Deal } from './useDealResultEvents';

/**
 * Tells the agent which listing the user is looking at.
 *
 * Data used to flow one way — the agent published deal cards and the browser
 * rendered them — so a click was invisible to the agent and "watch this one"
 * had no referent. This sends the selection up over RPC (`deal_selected`),
 * which the agent injects into the next conversation turn.
 *
 * Deliberately fire-and-forget: a failed RPC must never block the click from
 * opening the listing.
 */
const RPC_METHOD = 'deal_selected';

export function useDealSelection() {
  const room = useRoomContext();
  const agent = useAgent();
  // Avoid re-sending an identical selection on repeated clicks.
  const lastPayload = useRef<string | null>(null);

  // `identity` is only the *agent's* identity once it reports connected; in
  // the pending states it carries the local client's identity instead.
  const agentIdentity = agent.isConnected ? agent.identity : undefined;

  return useCallback(
    (deal: Deal | null) => {
      if (!room || !agentIdentity) return;

      const payload = deal
        ? JSON.stringify({
            title: deal.title,
            url: deal.url ?? null,
            source: deal.source ?? null,
            price: deal.price ?? null,
          })
        : JSON.stringify({ cleared: true });

      if (payload === lastPayload.current) return;
      lastPayload.current = payload;

      room.localParticipant
        .performRpc({ destinationIdentity: agentIdentity, method: RPC_METHOD, payload })
        .catch((error: unknown) => {
          // Let the next click retry rather than sticking on a failed payload.
          lastPayload.current = null;
          console.warn('[DealHunter] deal_selected RPC failed', error);
        });
    },
    [room, agentIdentity]
  );
}
