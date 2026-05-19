import express from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(upload.single('receipt'), createTransaction);

router
  .route('/:id')
  .get(getTransaction)
  .put(upload.single('receipt'), updateTransaction)
  .delete(deleteTransaction);

export default router;
