import Expense from '../models/Expense.js';
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

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    // Only get expenses for the logged-in user
    const expenses = await Expense.find({ user: req.user.id }).sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to access this expense');
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, transactionDate } = req.body;

    let receiptUrl = null;

    // Handle image upload if a file is present
    if (req.file) {
      const uploadResult = await streamUpload(req);
      receiptUrl = uploadResult.secure_url;
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      transactionDate: transactionDate ? new Date(transactionDate) : Date.now(),
      receipt: receiptUrl,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to update this expense');
    }

    let receiptUrl = expense.receipt;

    // Handle new image upload if a file is present
    if (req.file) {
      const uploadResult = await streamUpload(req);
      receiptUrl = uploadResult.secure_url;
      // In a real app, you might want to delete the old image from Cloudinary here
    }

    const updatedData = {
      ...req.body,
      receipt: receiptUrl,
    };

    expense = await Expense.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to delete this expense');
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
