import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getEvolutionAPI } from '@/lib/evolution-api';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('instances.delete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const instanceName = params.id;
    const api = getEvolutionAPI();
    await api.deleteInstance(instanceName);

    return NextResponse.json({ message: 'Instance deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting instance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete instance' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('instances.update')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const instanceName = params.id;
    const body = await request.json();
    const { action } = body;
    const api = getEvolutionAPI();

    switch (action) {
      case 'restart':
        await api.restartInstance(instanceName);
        return NextResponse.json({ message: 'Instance restarted successfully' });

      case 'connect':
        const connectResult = await api.connectInstance(instanceName);
        return NextResponse.json(connectResult);

      case 'logout':
        await api.logoutInstance(instanceName);
        return NextResponse.json({ message: 'Instance logged out successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error updating instance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update instance' },
      { status: 500 }
    );
  }
}
