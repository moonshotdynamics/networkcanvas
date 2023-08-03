import { prisma } from '../../lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
 
export async function GET (req: NextRequest, res: NextResponse) {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
    });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse
      .json({ error: 'Unable to fetch users', details: err });
  }
};

export async function PUT(req: NextRequest) {
  const { userId, role } = await req.json();

  try {
    // Get the Role record with the provided name
    let roleRecord = await prisma.role.findFirst({
      where: { name: role },
    });

    // If the role doesn't exist, create it
    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: {
          name: role,
        },
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: {
          connect: { id: roleRecord.id },
        },
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      error: 'Unable to update user role',
      details: err,
    });
  }
};


