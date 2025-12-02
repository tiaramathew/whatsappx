import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const searchParams = request.nextUrl.searchParams;
        const instanceName = searchParams.get('instance');

        if (!instanceName) return NextResponse.json({ error: 'Instance name required' }, { status: 400 });

        const groups = await prisma.contactGroup.findMany({
            where: { instanceName },
            include: { _count: { select: { members: true } } },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(groups);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { instanceName, name, description } = body;

        const group = await prisma.contactGroup.create({
            data: {
                instanceName,
                name,
                description,
            },
        });

        return NextResponse.json(group);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
