import Transaction from '../models/Transaction.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to upload image to cloudinary from buffer
const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'expense-tracker/receipts' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(req.file.buffer);
  });
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      res.status(404);
      throw new Error('Transaction not found');
    }
    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, paymentMethod, notes, date } = req.body;
    let receiptUrl = null;

    if (req.file) {
      const uploadResult = await streamUpload(req);
      receiptUrl = uploadResult.secure_url;
    }

    const transaction = await Transaction.create({
      title,
      amount,
      category,
      type,
      paymentMethod,
      notes,
      date: date ? new Date(date) : Date.now(),
      receipt: receiptUrl,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    let receiptUrl = transaction.receipt;
    if (req.file) {
      const uploadResult = await streamUpload(req);
      receiptUrl = uploadResult.secure_url;
    }

    const updatedData = {
      ...req.body,
      receipt: receiptUrl,
    };

    transaction = await Transaction.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      res.status(404);
      throw new Error('Transaction not found');
    }
    await transaction.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
