import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../../lib/mongodb';
import Booking from '../../../../models/Booking';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { status, notes } = await request.json();

    await connectDB();

    const booking = await Booking.findOne({
      _id: id,
      user: (session!.user as any).id
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();
    await booking.populate('car', 'name brand model pricePerDay images');

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const booking = await Booking.findOneAndDelete({
      _id: id,
      user: (session!.user as any).id,
      status: { $in: ['pending', 'confirmed'] } // Only allow cancellation of pending/confirmed bookings
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or cannot be cancelled' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
