import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getEvolutionAPI } from '@/lib/evolution-api';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/webhooks - Receive webhook events (no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Store webhook event in database
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO webhook_events (instance_name, event, data, received_at)
         VALUES ($1, $2, $3, NOW())`,
        [body.instance || 'unknown', body.event || 'unknown', JSON.stringify(body)]
      );
    } finally {
      client.release();
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/webhooks - Get webhook configuration
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('webhooks.read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const instanceName = searchParams.get('instance');

    if (!instanceName) {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      );
    }

    const api = getEvolutionAPI();
    const config = await api.getWebhook(instanceName);

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error fetching webhook config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get webhook configuration' },
      { status: 500 }
    );
  }
}

// PUT /api/webhooks - Update webhook configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('webhooks.update')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { instanceName, enabled, url, events, webhookByEvents } = body;

    if (!instanceName) {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      );
    }

    const api = getEvolutionAPI();
    await api.setWebhook(instanceName, {
      enabled,
      url,
      events,
      webhookByEvents,
    });

    return NextResponse.json({ message: 'Webhook configured successfully' });
  } catch (error: any) {
    console.error('Error updating webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set webhook configuration' },
      { status: 500 }
    );
  }
}
