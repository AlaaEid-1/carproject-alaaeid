import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Car from '../../../models/Car';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const year = searchParams.get('year');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
    const limit = searchParams.get('limit');
    const exclude = searchParams.get('exclude');

    let query: any = {};

    if (type && type !== 'undefined') query.type = type;
    if (year) query.year = parseInt(year);
    if (priceMin) query.price = { ...query.price, $gte: parseInt(priceMin) };
    if (priceMax) query.price = { ...query.price, $lte: parseInt(priceMax) };
    if (search) {
      const searchWords = search.split(/\s+/);
      query.$or = searchWords.flatMap(word => [
        { name: { $regex: word, $options: 'i' } },
        { brand: { $regex: word, $options: 'i' } }
      ]);
    }
    if (exclude && exclude !== 'undefined') query._id = { $ne: exclude };

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder;

    let carsQuery = Car.find(query).sort(sortOptions);
    if (limit) carsQuery = carsQuery.limit(parseInt(limit));

    const cars = await carsQuery;
    return NextResponse.json(cars);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const car = new Car(body);
    await car.save();

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
