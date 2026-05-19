import express from 'express';
import {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBudgets)
  .post(createOrUpdateBudget);

router
  .route('/:id')
  .delete(deleteBudget);

export default router;
