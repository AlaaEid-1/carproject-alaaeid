import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  type: { type: String, required: true, enum: ['SUV', 'Sedan', 'Hatchback', 'Truck', 'Convertible', 'Coupe'] },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  image: { type: String }, // for backward compatibility
  engine: { type: String },
  fuel: { type: String },
  colors: [{ type: String }],
  reviews: [ReviewSchema],
  rating: { type: Number, default: 0 },
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
