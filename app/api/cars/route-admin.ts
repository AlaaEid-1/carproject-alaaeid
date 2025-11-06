import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/mongodb';
import Car from '../../../models/Car';
import { authOptions } from '../../../lib/auth';

// Admin-only: Delete car
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('id');

    if (!carId) {
      return NextResponse.json({ error: 'Car ID required' }, { status: 400 });
    }

    await dbConnect();

    const car = await Car.findByIdAndDelete(carId);

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin-only: Update car
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('id');

    if (!carId) {
      return NextResponse.json({ error: 'Car ID required' }, { status: 400 });
    }

    const body = await request.json();

    await dbConnect();

    const car = await Car.findByIdAndUpdate(carId, body, { new: true });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
