import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET (req: NextRequest, res: NextResponse) {
  try {
    const files = await prisma.data.findMany();
    return NextResponse.json(files);
  } catch (err) {
    return NextResponse
      .json({ error: 'Unable to fetch files', details: err });
  }
};


export async function POST (req: NextRequest, res: NextResponse) {
  try {
    
  const { fileContent, fileName } = await req.json();
      const result = await prisma.data.create({
        data: {
          name: fileName,
          json: JSON.stringify(fileContent),
        },
      });
    
      return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error(err);
      return NextResponse.json(
        { message: 'Method not allowed' },
        {
          status: 405,
        }
      );
  }
};

