import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import TestDrive from '../../../models/TestDrive';
import Car from '../../../models/Car';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const testDrives = await TestDrive.find({ userId }).populate('carId');
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
    await dbConnect();

    const { userId, carId, preferredDate, preferredTime, contactInfo, notes } = await request.json();

    if (!userId || !carId || !contactInfo?.name || !contactInfo?.email) {
      return NextResponse.json({
        error: 'User ID, Car ID, and contact information (name, email) are required'
      }, { status: 400 });
    }

    // Check if test drive already exists for this user/car combination
    const existingTestDrive = await TestDrive.findOne({ userId, carId });
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

    return NextResponse.json(testDrive, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to book test drive' }, { status: 500 });
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
