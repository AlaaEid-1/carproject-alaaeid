import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import dbConnect from '../../../lib/mongodb';
import Favorite from '../../../models/Favorite';
import User from '../../../models/User';
import { authOptions } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const userId = (session as any).user.email;

    const favorites = await Favorite.find({ userId }).populate({
      path: 'carId',
      model: 'Car',
      localField: 'carId',
      foreignField: '_id'
    });

    // Filter out favorites where car is null (car was deleted)
    const validFavorites = favorites.filter(fav => fav.carId);
    return NextResponse.json(validFavorites);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/favorites called');
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { carId } = await request.json();
    const userId = (session as any).user.email;
    console.log('Request data:', { userId, carId });

    if (!userId || !carId) {
      return NextResponse.json({ error: 'User ID and Car ID are required' }, { status: 400 });
    }

    // Validate carId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      console.log('Invalid carId format');
      return NextResponse.json({ error: 'Invalid Car ID format' }, { status: 400 });
    }

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({ userId, carId });
    console.log('Existing favorite:', existingFavorite);
    if (existingFavorite) {
      return NextResponse.json({ error: 'Car already in favorites' }, { status: 409 });
    }

    const favorite = new Favorite({ userId, carId });
    await favorite.save();
    console.log('Favorite saved:', favorite);

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: `Failed to add favorite: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('carId');

    if (!carId) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    const userId = (session as any).user.email;

    await Favorite.findOneAndDelete({ userId, carId });
    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
