import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  carId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Note: Unique constraint handled in code to avoid index conflicts

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
