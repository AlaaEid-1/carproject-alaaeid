import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Could be user email or session ID
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to ensure a user can't favorite the same car twice
FavoriteSchema.index({ userId: 1, carId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
