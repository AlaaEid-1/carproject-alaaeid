import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../../lib/mongodb';
import TestDrive from '../../../../models/TestDrive';
import { authOptions } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const testDrives = await TestDrive.find({})
      .populate('userId', 'name email')
      .populate('carId', 'name brand type year')
      .sort({ createdAt: -1 });

    // Filter out test drives where carId or userId is null (if deleted)
    const validTestDrives = testDrives.filter(td => td.carId && td.userId);

    return NextResponse.json(validTestDrives);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch test drives' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Test drive ID is required' }, { status: 400 });
    }

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const testDrive = await TestDrive.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email').populate('carId', 'name brand type year');

    if (!testDrive) {
      return NextResponse.json({ error: 'Test drive not found' }, { status: 404 });
    }

    return NextResponse.json(testDrive);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update test drive' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Test drive ID is required' }, { status: 400 });
    }

    await TestDrive.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Test drive deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete test drive' }, { status: 500 });
  }
}
