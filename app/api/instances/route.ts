import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getEvolutionAPI } from '@/lib/evolution-api';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('instances.read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const api = getEvolutionAPI();
    const instances = await api.fetchInstances();

    return NextResponse.json(instances);
  } catch (error: any) {
    console.error('Error fetching instances:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch instances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('instances.create')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { instanceName } = body;

    if (!instanceName || typeof instanceName !== 'string') {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      );
    }

    const api = getEvolutionAPI();
    const result = await api.createInstance({ instanceName });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error creating instance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create instance' },
      { status: 500 }
    );
  }
}
