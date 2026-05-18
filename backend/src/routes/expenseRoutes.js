import express from 'express';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// All expense routes require authentication
router.use(protect);

// We use upload.single('receipt') to handle the optional image upload in create and update
router
  .route('/')
  .get(getExpenses)
  .post(upload.single('receipt'), createExpense);

router
  .route('/:id')
  .get(getExpense)
  .put(upload.single('receipt'), updateExpense)
  .delete(deleteExpense);

export default router;
