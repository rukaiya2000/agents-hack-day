import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { randomUUID } from 'node:crypto';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';
import { prisma } from '@/lib/prisma';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

type ProtocolDispatchContext = {
  id: string;
  nct?: string | null;
  title?: string | null;
  sponsor?: string | null;
  phase?: string | null;
  indication?: string | null;
  intervention?: string | null;
  patientPopulation?: string | null;
  geography?: string[];
  relevantSpecialties?: string[];
  enrollment?: string | null;
  status?: string | null;
};

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
// Agent dispatch name — must match the agent's registered name (`agent-py`). See `.env.local`.
const AGENT_NAME = process.env.AGENT_NAME;

// httpOnly cookie that persists a stable per-user id across visits. Stamped into the agent
// dispatch metadata as `{ "user_id": <uuid> }` so the agent can scope its Moss memory per user.
const USER_COOKIE = 'lk_moss_user';
const USER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

async function latestProtocolId() {
  try {
    const protocol = await prisma.protocol.findFirst({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      select: { protocolCode: true },
    });

    return protocol?.protocolCode ?? 'nct04816669-bnt162b2';
  } catch {
    return 'nct04816669-bnt162b2';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function contextFromBody(protocolId: string, value: unknown): ProtocolDispatchContext {
  if (!isRecord(value)) {
    return { id: protocolId };
  }

  return {
    id: typeof value.id === 'string' ? value.id : protocolId,
    nct: typeof value.nct === 'string' ? value.nct : null,
    title: typeof value.title === 'string' ? value.title : null,
    sponsor: typeof value.sponsor === 'string' ? value.sponsor : null,
    phase: typeof value.phase === 'string' ? value.phase : null,
    indication: typeof value.indication === 'string' ? value.indication : null,
    intervention: typeof value.intervention === 'string' ? value.intervention : null,
    patientPopulation:
      typeof value.patientPopulation === 'string'
        ? value.patientPopulation
        : typeof value.population === 'string'
          ? value.population
          : null,
    geography: stringArray(value.geography),
    relevantSpecialties: stringArray(value.relevantSpecialties),
    enrollment: typeof value.enrollment === 'string' ? value.enrollment : null,
    status: typeof value.status === 'string' ? value.status : null,
  };
}

async function storedProtocolContext(
  protocolId: string
): Promise<Partial<ProtocolDispatchContext>> {
  try {
    const protocol = await prisma.protocol.findFirst({
      where: { protocolCode: protocolId },
      select: {
        protocolCode: true,
        nctId: true,
        title: true,
        sponsor: true,
        phase: true,
        indication: true,
        intervention: true,
        patientPopulation: true,
        geographies: true,
        relevantSpecialties: true,
        enrollmentDisplay: true,
        enrollmentTarget: true,
        status: true,
      },
    });

    if (!protocol) {
      return {};
    }

    return {
      id: protocol.protocolCode,
      nct: protocol.nctId,
      title: protocol.title,
      sponsor: protocol.sponsor,
      phase: protocol.phase,
      indication: protocol.indication,
      intervention: protocol.intervention,
      patientPopulation: protocol.patientPopulation,
      geography: protocol.geographies,
      relevantSpecialties: protocol.relevantSpecialties,
      enrollment:
        protocol.enrollmentDisplay ??
        (typeof protocol.enrollmentTarget === 'number' ? `${protocol.enrollmentTarget}` : null),
      status: protocol.status.toString(),
    };
  } catch {
    return {};
  }
}

async function protocolDispatchContext(
  protocolId: string,
  bodyContext: unknown
): Promise<ProtocolDispatchContext> {
  const body = contextFromBody(protocolId, bodyContext);
  const stored = await storedProtocolContext(protocolId);

  return {
    ...body,
    ...stored,
    id: stored.id ?? body.id ?? protocolId,
    geography: stored.geography?.length ? stored.geography : body.geography,
    relevantSpecialties: stored.relevantSpecialties?.length
      ? stored.relevantSpecialties
      : body.relevantSpecialties,
  };
}

// don't cache the results
export const revalidate = 0;

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error(
      'THIS API ROUTE IS INSECURE. DO NOT USE THIS ROUTE IN PRODUCTION WITHOUT AN AUTHENTICATION LAYER.'
    );
  }

  try {
    if (LIVEKIT_URL === undefined) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (API_KEY === undefined) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (API_SECRET === undefined) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    // Resolve a stable per-user id from the httpOnly cookie, minting one on first visit.
    const cookieStore = await cookies();
    let userId = cookieStore.get(USER_COOKIE)?.value;
    const isNewUser = !userId;
    if (!userId) {
      userId = randomUUID();
    }

    // Parse room config from request body.
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const requestedProtocol =
      typeof body?.protocol_id === 'string'
        ? body.protocol_id
        : typeof body?.protocolId === 'string'
          ? body.protocolId
          : url.searchParams.get('protocol') || undefined;
    const protocolId = requestedProtocol || (await latestProtocolId());
    const protocolContext = await protocolDispatchContext(protocolId, body?.protocol_context);
    const roomConfig = body?.room_config
      ? RoomConfiguration.fromJson(body.room_config, { ignoreUnknownFields: true })
      : new RoomConfiguration();

    // Stamp `{ "user_id": <uuid> }` as the agent dispatch metadata. The agent reads this via
    // `ctx.job.metadata`. Ensure an agent dispatch entry exists (using AGENT_NAME for explicit
    // dispatch) and preserve any agent name already supplied by the client.
    if (roomConfig.agents.length === 0) {
      roomConfig.agents.push(new RoomAgentDispatch({ agentName: AGENT_NAME ?? '' }));
    }
    const dispatchMetadata = JSON.stringify({
      user_id: userId,
      protocol_id: protocolId,
      protocol_context: protocolContext,
    });
    for (const agent of roomConfig.agents) {
      if (!agent.agentName && AGENT_NAME) {
        agent.agentName = AGENT_NAME;
      }
      agent.metadata = dispatchMetadata;
    }

    // Generate participant token
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      roomConfig
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantName,
      participantToken,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
    const response = NextResponse.json(data, { headers });

    // Persist the per-user id for subsequent visits (only needs writing when freshly minted).
    if (isNewUser) {
      response.cookies.set(USER_COOKIE, userId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: (process.env.NODE_ENV as string) === 'production',
        path: '/',
        maxAge: USER_COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  roomConfig: RoomConfiguration | undefined
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  if (roomConfig) {
    at.roomConfig = roomConfig;
  }

  return at.toJwt();
}
