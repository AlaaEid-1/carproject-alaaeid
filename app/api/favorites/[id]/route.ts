import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../../lib/mongodb';
import Favorite from '../../../../models/Favorite';
import User from '../../../../models/User';

const authOptions = {
  providers: [],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const userId = (session as any).user.email;

    if (!id || !userId) {
      return NextResponse.json({ error: 'Favorite ID and User ID are required' }, { status: 400 });
    }

    // Find and delete favorite by carId and userId
    const favorite = await Favorite.findOneAndDelete({ carId: id, userId });

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
