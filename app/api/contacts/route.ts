import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const instanceName = searchParams.get('instance');
    const search = searchParams.get('search');

    if (!instanceName) return NextResponse.json({ error: 'Instance name required' }, { status: 400 });

    const contacts = await prisma.contact.findMany({
      where: {
        instanceName,
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { pushName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { instanceName, name, phone, email, tags } = body;

    const contact = await prisma.contact.create({
      data: {
        instanceName,
        remoteJid: `${phone}@s.whatsapp.net`,
        name,
        phone,
        email,
        tags,
      },
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
