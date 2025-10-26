import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Favorite from '../../../../models/Favorite';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Favorite ID is required' }, { status: 400 });
    }

    const favorite = await Favorite.findByIdAndDelete(id);

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
