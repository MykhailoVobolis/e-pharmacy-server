import { model, Schema } from 'mongoose';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

// Схема для елемента в кошику
const cartProductSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'products', // Посилання на колекцію `products`
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Кількість не може бути менше 1
  },
  price: {
    type: String,
    required: true,
  },
});

// Схема для кошика
const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user', // Посилання на колекцію `users`
      required: true,
    },
    products: [cartProductSchema], // Масив товарів у кошику
    totalProducts: {
      type: Number,
      required: true,
      default: 0, // Загальна кількість номенклатур
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // Загальна сума кошика
    },
  },
  { versionKey: false, timestamps: true },
);

// Використання Mongoose хук mongooseSaveError при додаванні("save") об'єкта що не відповідає схемі валідації
cartSchema.post('save', mongooseSaveError);

// Використання Mongoose хук setUpdateSettings перед ("pre") оновленням об'екта
cartSchema.pre('findOneAndUpdate', setUpdateSettings);

// Використання Mongoose хук mongooseSaveError при оновленні "findOneAndUpdate" об'єкта що не відповідає схемі валідації
cartSchema.post('findOneAndUpdate', mongooseSaveError);

export const CartCollection = model('cart', cartSchema);
