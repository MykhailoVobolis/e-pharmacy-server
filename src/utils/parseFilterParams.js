const parseCategory = (category, categories) => {
  const isString = typeof category === 'string';

  if (!isString) return;
  const isCategory = (category) => categories.includes(category);

  if (isCategory(category)) {
    return category;
  }
};

const parseString = (value) => {
  return typeof value === 'string' ? value : undefined;
};

export const parseFilterParams = (query, categories) => {
  const { category, name, discount } = query;

  const parsedCategory = parseCategory(category, categories);

  const parsedName = parseString(name);

  const parsedDiscount = parseString(discount);

  return {
    category: parsedCategory,
    name: parsedName,
    discount: parsedDiscount,
  };
};
