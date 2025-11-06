import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@alaexplorion.com' });
    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        email: existingAdmin.email
      });
    }

    // Hash the password properly
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@alaexplorion.com',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();

    return NextResponse.json({
      message: 'Admin user created successfully',
      email: 'admin@alaexplorion.com',
      password: 'admin123'
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
