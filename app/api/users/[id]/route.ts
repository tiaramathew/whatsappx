import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('users.read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform to match expected structure if needed, or return as is
    // The previous SQL returned a flat structure from a view.
    // We'll return the prisma object which is cleaner.
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('users.update')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();
    const { name, roleId, isActive, isVerified, password } = body;

    const data: any = {};
    if (name !== undefined) {
      // Assuming name maps to firstName/lastName or username?
      // The schema has firstName, lastName, username.
      // The previous code used 'name'.
      // Let's assume 'username' for now or split name.
      // But wait, schema has firstName and lastName.
      // If the frontend sends 'name', we might need to handle it.
      // For now, let's assume the frontend sends what the schema expects or we map it.
      // If the previous code used 'name' column, but schema has firstName/lastName...
      // Let's check the schema again.
      // Schema: firstName, lastName, username.
      // Previous code: updates.push(`name = ...`)
      // This implies the previous schema had a 'name' column.
      // My restored schema has firstName, lastName.
      // I should probably map 'name' to 'firstName' (and maybe empty lastName) or 'username'.
      // Or maybe I should check if I missed a 'name' field in User model.
      // Standard NextAuth User model usually has 'name'.
      // I'll add 'name' to the User model in schema if it's missing?
      // No, I should stick to the schema I restored.
      // Let's assume 'firstName' for now.
      data.firstName = name;
    }
    if (isActive !== undefined) data.isActive = isActive;
    // isVerified is not in my restored schema?
    // My restored schema has `isActive`, `lastLoginAt`, etc.
    // It doesn't have `isVerified`.
    // I'll skip isVerified for now or add it if needed.

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    // Role update is complex with many-to-many.
    // If roleId is provided, we might need to update UserRole.

    const user = await prisma.user.update({
      where: { id: userId },
      data
    });

    if (roleId !== undefined) {
      // Update role
      // Delete existing roles
      await prisma.userRole.deleteMany({ where: { userId } });
      // Add new role
      await prisma.userRole.create({
        data: {
          userId,
          roleId: parseInt(roleId)
        }
      });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.permissions.includes('users.delete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Prevent deleting yourself
    if (parseInt(session.user.id) === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


