import { model, Schema } from 'mongoose';

const storeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const StoreCollection = model('pharmacies', storeSchema);
export const NearestStoreCollection = model('nearest_pharmacies', storeSchema);
