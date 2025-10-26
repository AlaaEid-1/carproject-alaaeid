import mongoose from 'mongoose';

const TestDriveSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Could be user email or session ID
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index to prevent duplicate bookings for same user/car
TestDriveSchema.index({ userId: 1, carId: 1 }, { unique: true });

export default mongoose.models.TestDrive || mongoose.model('TestDrive', TestDriveSchema);
