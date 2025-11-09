import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import testDriveRoutes from './routes/testDriveRoutes.js';
import leaseRoutes from './routes/leaseRoutes.js';
import { initUsers } from './models/userModel.js';
import { initTestDrives } from './models/testDriveModel.js';
import { initLeases } from './controllers/leaseController.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();

dotenv.config();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use('/', authRoutes);
app.use('/api/cars', authMiddleware, carRoutes);
app.use('/api/testdrive', authMiddleware, testDriveRoutes);
app.use('/api/lease', authMiddleware, leaseRoutes);

app.use((req, res) => res.status(404).json({ error: 'route not found' }));

const PORT = process.env.PORT || 3000;

const start = async () => {
  await initUsers();
  await initTestDrives();
  await initLeases();
  app.listen(PORT, () =>
    console.log(`API running at http://localhost:${PORT}`)
  );
};

start();
