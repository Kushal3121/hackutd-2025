import express from 'express';
import {
  getAllCars,
  getCarById,
  filterCars,
  getCarPackages,
  getCarDrivetrainOptions,
  getCarInteriors,
  getCarAccessories,
  getCarInsurancePlans,
  getCarFinance,
  getCarSummary,
} from '../controllers/carController.js';

const router = express.Router();

router.get('/', getAllCars); // /api/cars
router.get('/filter', filterCars); // /api/cars/filter?region=US&year=2024
router.get('/:id', getCarById); // /api/cars/CAR-1
router.get('/:id/packages', getCarPackages);
router.get('/:id/drivetrain-options', getCarDrivetrainOptions);
router.get('/:id/interiors', getCarInteriors);
router.get('/:id/accessories', getCarAccessories);
router.get('/:id/insurance', getCarInsurancePlans);
router.get('/:id/finance', getCarFinance);
router.get('/:id/summary', getCarSummary);

export default router;
