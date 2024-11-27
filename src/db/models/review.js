import { model, Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const ReviewsCollection = model('reviews', reviewSchema);
