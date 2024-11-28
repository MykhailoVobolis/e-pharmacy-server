import { NearestStoreCollection, StoreCollection } from '../db/models/store.js';

export const getNearestStores = async (req, res) => {
  // запит за 6 рандомними значеннями з бази даних
  const nearestStores = await NearestStoreCollection.aggregate([
    { $sample: { size: 6 } },
  ]);

  res.json({
    status: 200,
    message: 'Successfully found nearest stores!',
    data: nearestStores,
  });
};

export const getAllStores = async (req, res) => {
  const { limit = 9 } = req.body;
  let filter = {};

  const stores = await StoreCollection.find(filter).limit(limit);

  res.json({
    status: 200,
    message: 'Successfully found stores!',
    data: stores,
  });
};
