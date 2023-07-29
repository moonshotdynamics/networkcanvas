import { prisma } from '../../lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const hashed_password = await hash(body.password, 12);

    let participantRole = await prisma.role.findFirst({
      where: { name: 'participant' },
    });

    if (!participantRole) {
      participantRole = await prisma.role.create({
        data: {
          name: 'participant',
        },
      });
    }
       const existingUser = await prisma.user.findUnique({
         where: { email: body.email.toLowerCase() },
       });

       if (existingUser) {
         return NextResponse.json(
           {
             error: 'A user with this email already exists',
           },
           { status: 400 }
         );
       }
//Assign each new user the role of participant
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        password: hashed_password,
        roleId: participantRole.id,
      },
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
