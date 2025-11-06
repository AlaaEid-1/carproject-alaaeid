import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import dbConnect from '../../../lib/mongodb';
import TestDrive from '../../../models/TestDrive';
import Car from '../../../models/Car';
import User from '../../../models/User';
import { authOptions } from '../../../lib/auth';
import { Session } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    // Get user ObjectId from email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const testDrives = await TestDrive.find({ userId: user._id }).populate('carId');
    // Filter out test drives where carId is null (car was deleted)
    const validTestDrives = testDrives.filter(td => td.carId);
    return NextResponse.json(validTestDrives);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch test drives' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/test-drives called');
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { carId, preferredDate, preferredTime, contactInfo, notes } = await request.json();

    // Get user ObjectId from email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;
    console.log('Request data:', { userId, carId, contactInfo });

    if (!userId || !carId || !contactInfo?.name || !contactInfo?.email) {
      return NextResponse.json({
        error: 'User ID, Car ID, and contact information (name, email) are required'
      }, { status: 400 });
    }

    // Validate carId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      console.log('Invalid carId format');
      return NextResponse.json({ error: 'Invalid Car ID format' }, { status: 400 });
    }

    // Check if test drive already exists for this user/car combination
    const existingTestDrive = await TestDrive.findOne({ userId, carId });
    console.log('Existing test drive:', existingTestDrive);
    if (existingTestDrive) {
      return NextResponse.json({ error: 'Test drive already booked for this car' }, { status: 409 });
    }

    const testDrive = new TestDrive({
      userId,
      carId,
      preferredDate,
      preferredTime,
      contactInfo,
      notes,
    });

    await testDrive.save();
    console.log('Test drive saved:', testDrive);

    return NextResponse.json(testDrive, { status: 201 });
  } catch (error) {
    console.error('Error booking test drive:', error);
    return NextResponse.json({ error: `Failed to book test drive: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const { id, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Test drive ID is required' }, { status: 400 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const testDrive = await TestDrive.findByIdAndUpdate(id, updateData, { new: true });
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
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Test drive ID is required' }, { status: 400 });
    }

    await TestDrive.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Test drive cancelled successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to cancel test drive' }, { status: 500 });
  }
}
