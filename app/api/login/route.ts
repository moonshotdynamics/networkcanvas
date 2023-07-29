import { prisma } from '../../lib/prisma';
import { compare } from 'bcryptjs';

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
export async function POST(req: Request) {
  const body: RequestBody = await req.json();


  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
    include: {
      role: true,
    },
  });


  if (user && (await compare(body.password, user.password as string))) {
    const { password, ...userWithoutPass } = user;
    return new Response(JSON.stringify(userWithoutPass));
  } else return new Response(JSON.stringify(null));
}
