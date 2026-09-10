import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IWishlistItem extends Document {
  userId: string;
  movieId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  createdAt: Date;
}

const wishlistSchema = new Schema<IWishlistItem>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterPath: {
      type: String,
      default: null,
    },
    releaseDate: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

wishlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Wishlist: Model<IWishlistItem> = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
