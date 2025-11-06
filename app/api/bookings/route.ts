
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '../../../lib/mongodb';
import Booking from '../../../models/Booking';
import Car from '../../../models/Car';
import User from '../../../models/User';
import { authOptions } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { carId, startDate, endDate, notes } = await request.json();

    // Validate input
    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Car ID, start date, and end date are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if car exists
    const car = await (Car as any).findById(carId);
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    // Check for conflicting bookings
    const conflictingBooking = await (Booking as any).findOne({
      car: carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lt: end, $gte: start } },
        { endDate: { $gt: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } }
      ]
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Car is not available for the selected dates' },
        { status: 409 }
      );
    }

    // Calculate total price (assuming daily rate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    // Get user ObjectId from email
    const user = await (User as any).findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await (Booking as any).create({
      user: user._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice,
      notes,
    });

    // Populate car details
    await booking.populate('car', 'name brand type year pricePerDay images');

    return NextResponse.json(
      {
        message: 'Booking created successfully',
        booking
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user ObjectId from email
    const user = await (User as any).findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const bookings = await (Booking as any).find({ user: user._id })
      .populate('car', 'name brand type year pricePerDay images')
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user ObjectId from email
    const user = await (User as any).findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find and delete the booking, ensuring it belongs to the authenticated user
    const booking = await (Booking as any).findOneAndDelete({
      _id: bookingId,
      user: user._id,
      status: { $in: ['pending', 'confirmed'] } // Only allow cancellation of pending or confirmed bookings
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or cannot be cancelled' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
