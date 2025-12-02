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

        const conversations = await prisma.conversation.findMany({
            where: { instanceName },
            include: { contact: true },
            orderBy: { lastMessageAt: 'desc' },
        });

        return NextResponse.json(conversations);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
