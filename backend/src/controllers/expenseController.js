import Expense from '../models/Expense.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/Notification.js';
import Budget from '../models/Budget.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

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

    // Check budget for alerts
    try {
      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const budget = await Budget.findOne({ user: req.user.id, month: currentMonthStr, category: 'All' }); 
      // If there's no 'All' budget, maybe check sum of all budgets, but let's check total month expenses against sum of all budgets
      
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const currentMonthTxns = await Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const currentExpense = currentMonthTxns[0] ? currentMonthTxns[0].total : 0;
      
      const allBudgets = await Budget.find({ user: req.user.id, month: currentMonthStr });
      const totalBudget = allBudgets.reduce((acc, b) => acc + b.limitAmount, 0);

      if (totalBudget > 0) {
        let alertTriggered = false;
        let alertMessage = '';
        let alertType = '';

        if (currentExpense > totalBudget) {
          alertTriggered = true;
          alertMessage = `Your monthly spending (₹${currentExpense}) has exceeded your total budget (₹${totalBudget}).`;
          alertType = 'alert';
        } else if (currentExpense > totalBudget * 0.8) {
          alertTriggered = true;
          alertMessage = `Warning: You have used ${((currentExpense / totalBudget) * 100).toFixed(0)}% of your monthly budget.`;
          alertType = 'warning';
        }

        if (alertTriggered) {
          // Check if we already sent this exact alert type recently so we don't spam
          const recentAlert = await Notification.findOne({
            user: req.user.id,
            type: alertType,
            createdAt: { $gte: startOfCurrentMonth }
          });

          if (!recentAlert || alertType === 'alert') {
            await Notification.create({
              user: req.user.id,
              title: alertType === 'alert' ? 'Budget Exceeded' : 'Budget Warning',
              message: alertMessage,
              type: alertType,
            });

            // Send Email
            const user = await User.findById(req.user.id);
            if (user) {
              await sendEmail({
                email: user.email,
                subject: alertType === 'alert' ? '🚨 SpendWise: Budget Exceeded' : '⚠️ SpendWise: Budget Warning',
                message: alertMessage,
                html: `<div style="font-family:sans-serif;padding:20px;border-radius:10px;background:#f9fafb;">
                        <h2 style="color:${alertType === 'alert' ? '#dc2626' : '#d97706'}">${alertType === 'alert' ? 'Budget Exceeded' : 'Budget Warning'}</h2>
                        <p style="font-size:16px;">${alertMessage}</p>
                        <p>Keep track of your spending in your <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">SpendWise Dashboard</a>.</p>
                       </div>`
              }).catch(err => console.log('Email sending failed:', err));
            }
          }
        }
      }
    } catch (err) {
      console.log('Error triggering alert:', err);
    }

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
