import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/mongodb';
import Car from '../../../models/Car';
import { authOptions } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const car = new Car(body);
    await car.save();

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
