import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Car from '../../../models/Car';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const cars = await Car.find({});
    const allReviews = cars.flatMap(car => car.reviews);

    return NextResponse.json(allReviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { carId, user, rating, comment } = await request.json();

    if (!carId || !user || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    const newReview = {
      user,
      rating: parseInt(rating),
      comment,
      createdAt: new Date(),
    };

    car.reviews.push(newReview);
    await car.save();

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
