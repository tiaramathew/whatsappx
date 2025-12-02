import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Assuming any authenticated user can list roles for now, or restrict to admin
    // if (!session.user.permissions.includes('roles.read')) ...

    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
