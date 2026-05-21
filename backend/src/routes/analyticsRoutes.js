import express from 'express';
import {
  getSummary,
  getCategoryStats,
  getTrends,
  getTopCategories,
  getAdvancedAnalytics
} from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/categories', getCategoryStats);
router.get('/trends', getTrends);
router.get('/top-categories', getTopCategories);
router.get('/advanced', getAdvancedAnalytics);

export default router;
