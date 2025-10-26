import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Favorite from '../../../models/Favorite';
import Car from '../../../models/Car';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const favorites = await Favorite.find({ userId }).populate('carId');
    // Filter out favorites where carId is null (car was deleted)
    const validFavorites = favorites.filter(fav => fav.carId);
    return NextResponse.json(validFavorites);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, carId } = await request.json();

    if (!userId || !carId) {
      return NextResponse.json({ error: 'User ID and Car ID are required' }, { status: 400 });
    }

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({ userId, carId });
    if (existingFavorite) {
      return NextResponse.json({ error: 'Car already in favorites' }, { status: 409 });
    }

    const favorite = new Favorite({ userId, carId });
    await favorite.save();

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const carId = searchParams.get('carId');

    if (!userId || !carId) {
      return NextResponse.json({ error: 'User ID and Car ID are required' }, { status: 400 });
    }

    await Favorite.findOneAndDelete({ userId, carId });
    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
