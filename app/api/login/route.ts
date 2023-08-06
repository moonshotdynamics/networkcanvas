import { prisma } from '../../lib/prisma';
import { compare } from 'bcryptjs';
import { NextResponse, NextRequest } from 'next/server';

interface RequestBody {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body: RequestBody = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
    include: {
      role: true,
    },
  });

  if (!user) {

    return NextResponse.json(
    { error: 'Email not found'
    },
      { status: 404 });
  }

  const passwordMatch = await compare(body.password, user.password as string);
  if (passwordMatch) {
    const { password, ...userWithoutPass } = user;
    return NextResponse.json(userWithoutPass);
  } else {
    return NextResponse.json(
      { error: "Invalid password"},
      { status: 500 })
  }
}

