import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../../lib/mongodb';
import Car from '../../../../models/Car';
import { authOptions } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const count = await Car.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching car stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
