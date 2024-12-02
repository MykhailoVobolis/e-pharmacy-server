import {
  addProductsToCart,
  deleteProductFromCart,
  getCartById,
} from '../services/cart.js';
import { transformCartData } from '../utils/transformCartData.js';

export const addProductsToCartController = async (req, res) => {
  const userId = req.user._id; // Або req.user.id, залежно від вашої схеми
  const products = req.body.products;

  const cart = await addProductsToCart(userId, products);

  const data = transformCartData(cart);

  res.status(201).json({
    status: 201,
    message: 'Products successfully added to cart!',
    data,
  });
};

export const getCartByIdController = async (req, res) => {
  const userId = req.user._id;

  const cart = await getCartById(userId);

  const data = transformCartData(cart);

  res.status(200).json({
    status: 200,
    message: `Successfully found user cart!`,
    data,
  });
};

export const deleteProductFromCartController = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const updatedCart = await deleteProductFromCart(userId, productId);

  const data = transformCartData(updatedCart);

  res.status(200).json({
    status: 200,
    message: 'Product removed from cart',
    data,
  });
};
