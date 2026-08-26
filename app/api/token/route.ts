// app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const roomName = body.room_name || `room-${Date.now()}`;
    const participantIdentity =
      body.participant_identity || `user-${Date.now()}`;
    const participantName = body.participant_name || 'User';
    const roomConfig = body.room_config;

    // LiveKit metadata لازم string — لو جاية object نحوّلها
    const rawMeta = body.participant_metadata;
    const metadata =
      rawMeta == null
        ? ''
        : typeof rawMeta === 'string'
          ? rawMeta
          : JSON.stringify(rawMeta);

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName,
      metadata,
      attributes: body.participant_attributes || {},
      ttl: '10m',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    // Always dispatch the لقمة worker. An unnamed worker on the same LiveKit
    // project was swallowing rooms (token 201, no job on this host).
    const agentName = process.env.LIVEKIT_AGENT_NAME || 'luqma';
    const incoming =
      roomConfig && typeof roomConfig === 'object'
        ? (roomConfig as { agents?: Array<{ agentName?: string }> })
        : {};
    const agents =
      Array.isArray(incoming.agents) && incoming.agents.length > 0
        ? incoming.agents
        : [{ agentName }];
    at.roomConfig = new RoomConfiguration({ ...incoming, agents });

    const participantToken = await at.toJwt();

    return NextResponse.json(
      {
        server_url: serverUrl,
        participant_token: participantToken,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 },
    );
  }
}