import {
  addTestDrive,
  getTestDrivesByUser,
} from '../models/testDriveModel.js';

const randomEta = () => 3 + Math.floor(Math.random() * 5); // 3-7

export const bookTestDrive = async (req, res) => {
  try {
    const { userId, carId, carName, color, packages = [], totalPrice } =
      req.body ?? {};

    if (!userId || !carId || !carName)
      return res
        .status(400)
        .json({ error: 'userId, carId and carName are required' });

    const base = {
      userId,
      carId,
      carName,
      color: color ?? null,
      packages: Array.isArray(packages) ? packages : [],
      totalPrice: Number.isFinite(totalPrice) ? totalPrice : null,
      status: 'booked',
      etaDays: randomEta(),
      bookedAt: new Date().toISOString(),
    };
    const record = await addTestDrive(base);
    res.status(201).json(record);
  } catch (e) {
    res.status(500).json({ error: 'Failed to book test drive' });
  }
};

export const getUserTestDrives = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const list = await getTestDrivesByUser(userId);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch test drives' });
  }
};


