import express from 'express';
import { getReportData } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All report routes require authentication

router.get('/', getReportData);

export default router;
