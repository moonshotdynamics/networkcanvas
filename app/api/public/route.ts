import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const mostRecentData = await prisma.data.findFirst({
      orderBy: {
        id: 'desc',
      },
    });
    if (!mostRecentData) {
      return NextResponse.json(
        { error: 'No data found' },
        {
          status: 404,
        }
      );
    }
    const jsonData = JSON.parse(mostRecentData.json);
    return NextResponse.json(jsonData);
  } catch (err) {
    return NextResponse.json({ error: 'Unable to fetch users', details: err });
  }
};
