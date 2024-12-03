import { model, Schema } from 'mongoose';
import { mongooseSaveError } from './hooks.js';
import { regex } from '../../constants/user.js';

const { emailRegexp, phoneNumberRegexp } = regex;

// Схема для елемента в кошику
const detailsSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, match: emailRegexp, required: true },
  phone: { type: String, match: phoneNumberRegexp, required: true },
  address: { type: String, required: true },
  payment: {
    type: String,
    enum: ['cash', 'bank'],
    required: true,
  },
});

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    orderDetails: { type: detailsSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { versionKey: false, timestamps: true },
);

// Використання Mongoose хук mongooseSaveError при додаванні("save") об'єкта що не відповідає схемі валідації
orderSchema.post('save', mongooseSaveError);

export const OrderCollection = model('order', orderSchema);
