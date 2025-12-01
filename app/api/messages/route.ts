import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getEvolutionAPI } from '@/lib/evolution-api';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('messages.send')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { instanceName, number, text, mediaUrl, mediaType, fileName, caption } = body;

    if (!instanceName || typeof instanceName !== 'string') {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      );
    }

    if (!number || typeof number !== 'string') {
      return NextResponse.json(
        { error: 'Recipient number is required' },
        { status: 400 }
      );
    }

    const api = getEvolutionAPI();
    let result;

    if (mediaUrl) {
      result = await api.sendMedia(instanceName, {
        number,
        media: mediaUrl,
        mediatype: mediaType,
        fileName,
        caption,
      });
    } else {
      if (!text) {
        return NextResponse.json(
          { error: 'Message text is required' },
          { status: 400 }
        );
      }

      result = await api.sendText(instanceName, {
        number,
        text,
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
