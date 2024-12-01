const parseCategory = (category, categories) => {
  const isString = typeof category === 'string';

  if (!isString) return;
  const isCategory = (category) => categories.includes(category);

  if (isCategory(category)) {
    return category;
  }
};

const parseName = (name) => {
  return typeof name === 'string' ? name : undefined;
};

export const parseFilterParams = (query, categories) => {
  const { category, name } = query;

  const parsedCategory = parseCategory(category, categories);

  const parsedName = parseName(name);

  return {
    category: parsedCategory,
    name: parsedName,
  };
};
