import express from 'express';
import {
  bookTestDrive,
  getUserTestDrives,
} from '../controllers/testDriveController.js';

const router = express.Router();

router.post('/', bookTestDrive); // POST /api/testdrive
router.get('/:userId', getUserTestDrives); // GET /api/testdrive/:userId

export default router;


