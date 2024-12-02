import createHttpError from 'http-errors';
import { CartCollection } from '../db/models/cart.js';

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
      existingProduct.quantity += newProduct.quantity;
      existingProduct.price = newProduct.price;
    } else {
      cart.products.push(newProduct);
    }
  });

  // Кількість продуктів у кошику
  cart.totalProducts = cart.products.length;
  // Сума всіх товарів у кошику
  cart.totalPrice = cart.products
    .reduce(
      (total, product) => total + parseFloat(product.price) * product.quantity,
      0,
    )
    .toFixed(2);

  await cart.save();

  // Підтягуємо дані про всі продукти з колекції ProductsCollection
  const populatedCart = await CartCollection.findById(cart._id).populate(
    'products.productId', // Динамічно витягуємо дані про продукт
    'photo name category price', // Обираємо лише потрібні поля
  );

  return populatedCart;
};

export const getCartById = async (userId) => {
  const cart = await CartCollection.findOne({ userId });

  if (!cart) {
    throw createHttpError(404, 'Cart not found');
  }

  // Підтягуємо дані про всі продукти з колекції ProductsCollection
  const populatedCart = await CartCollection.findById(cart._id).populate(
    'products.productId', // Динамічно витягуємо дані про продукт
    'photo name category price', // Обираємо лише потрібні поля
  );

  //   return cart;
  return populatedCart;
};
