import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
