import createHttpError from 'http-errors';
import { CartCollection } from '../db/models/cart.js';
import { OrderCollection } from '../db/models/order.js';
import { transformCartData } from '../utils/transformCartData.js';

export const addProductsToCart = async (userId, products) => {
  // Шукаємо кошик користувача за його унікальним ідентифікатором (userId)
  const cart = await CartCollection.findOne({ userId });

  // Якщо кошик для користувача не існує, створюємо новий кошик
  if (!cart) {
    const newCart = new CartCollection({
      userId,
      products,
    });

    // Кількість продуктів у кошику
    newCart.totalProducts = products.length;
    // Сума всіх товарів у кошику
    newCart.totalPrice = products
      .reduce(
        (total, product) =>
          total + parseFloat(product.price) * product.quantity,
        0,
      )
      .toFixed(2);

    await newCart.save();

    // Підтягуємо дані про всі продукти з колекції ProductsCollection
    const populatedCart = await CartCollection.findById(newCart._id).populate(
      'products.productId', // Динамічно витягуємо дані про продукт
      'photo name category price', // Обираємо лише потрібні поля
    );

    return populatedCart;
  }

  // Якщо кошик існує, оновлюємо список продуктів
  products.forEach((newProduct) => {
    const existingProduct = cart.products.find((item) =>
      item.productId.equals(newProduct.productId),
    );

    if (existingProduct) {
      // Якщо кількість нового товару не дорівнює існуючій, оновлюємо кількість
      if (newProduct.quantity !== existingProduct.quantity) {
        existingProduct.quantity = newProduct.quantity;
        existingProduct.price = newProduct.price; // Оновлюємо ціну продукту
      } else {
        return; // Нічого не змінюємо, якщо кількість однакова
      }
    } else {
      // Якщо продукту немає в кошику — додаємо його
      cart.products.push(newProduct);
    }
  });

  cart.totalProducts = cart.products.length;
  cart.totalPrice = cart.products
    .reduce(
      (total, product) => total + parseFloat(product.price) * product.quantity,
      0,
    )
    .toFixed(2);

  await cart.save();

  const populatedCart = await CartCollection.findById(cart._id).populate(
    'products.productId',
    'photo name category price',
  );

  return populatedCart;
};

export const getCartById = async (userId) => {
  const cart = await CartCollection.findOne({ userId });

  if (!cart) {
    throw createHttpError(404, 'Cart not found');
  }

  const populatedCart = await CartCollection.findById(cart._id).populate(
    'products.productId',
    'photo name category price',
  );

  return populatedCart;
};

export const deleteProductFromCart = async (userId, productId) => {
  const cart = await CartCollection.findOne({ userId });

  if (!cart) {
    throw createHttpError(404, 'Cart not found');
  }

  // Фільтруємо продукти, щоб видалити потрібний
  const updatedProducts = cart.products.filter(
    (item) => item.productId.toString() !== productId,
  );

  if (updatedProducts.length === cart.products.length) {
    throw createHttpError(404, 'Product not found in cart');
  }

  // Оновлюємо продукти, totalProducts та totalPrice
  cart.products = updatedProducts;
  cart.totalProducts = updatedProducts.length;
  cart.totalPrice = updatedProducts
    .reduce((total, product) => total + product.price * product.quantity, 0)
    .toFixed(2);

  await cart.save();

  const populatedCart = await CartCollection.findById(cart._id).populate(
    'products.productId',
    'photo name category price',
  );

  return populatedCart;
};

export const createOrder = async (userId, orderDetails) => {
  const cart = await CartCollection.findOne({ userId });

  if (!cart) {
    throw createHttpError(404, 'Cart not found');
  }

  if (!cart || cart.products.length === 0) {
    throw createHttpError(400, 'Cart is empty');
  }

  const populatedCart = await CartCollection.findById(cart._id).populate(
    'products.productId',
    'photo name category price',
  );

  const data = transformCartData(populatedCart);

  // Створення замовлення у DB
  await OrderCollection.create({
    userId,
    products: cart.products,
    totalPrice: cart.totalPrice,
    orderDetails, // Зберегти дані про деталі замовлення (оплата, адреса, контакти)
    status: 'confirmed', // Замовлення підтверджене
  });

  // Очистити кошик
  cart.products = [];
  cart.totalProducts = 0;
  cart.totalPrice = 0;

  await cart.save();

  return {
    data,
    orderDetails,
    status: 'confirmed',
    createdAt: new Date(),
  };
};
