export const transformCartData = (cart) => {
  const { products, totalProducts, totalPrice } = cart;

  const transformedProducts = products.map(({ productId, quantity }) => ({
    photo: productId.photo,
    name: productId.name,
    price: productId.price,
    category: productId.category,
    quantity,
  }));

  return {
    products: transformedProducts,
    totalProducts,
    totalPrice,
  };
};
