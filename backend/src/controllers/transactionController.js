import Transaction from '../models/Transaction.js';
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

    // Handle Budget and Overspending Alerts for Expenses
    if (type === 'expense') {
      try {
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const currentMonthTxns = await Transaction.aggregate([
          { $match: { user: req.user._id, date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } } },
          { $group: { 
              _id: '$type', 
              total: { $sum: '$amount' } 
            } 
          }
        ]);
        
        let currentExpense = 0;
        let currentIncome = 0;
        currentMonthTxns.forEach(t => {
          if (t._id === 'expense') currentExpense = t.total;
          if (t._id === 'income') currentIncome = t.total;
        });
        
        const allBudgets = await Budget.find({ user: req.user.id, month: currentMonthStr });
        const totalBudget = allBudgets.reduce((acc, b) => acc + b.limitAmount, 0);

        let alertTriggered = false;
        let alertMessage = '';
        let alertType = '';

        // Check 1: Overspending (Expenses > Income)
        if (currentIncome > 0 && currentExpense > currentIncome) {
          alertTriggered = true;
          alertMessage = `You are overspending this month! Your expenses (₹${currentExpense}) have exceeded your income (₹${currentIncome}).`;
          alertType = 'alert';
        } 
        // Check 2: Budget Exceeded
        else if (totalBudget > 0 && currentExpense > totalBudget) {
          alertTriggered = true;
          alertMessage = `Your monthly spending (₹${currentExpense}) has exceeded your total budget (₹${totalBudget}).`;
          alertType = 'alert';
        } 
        // Check 3: Budget Warning (80%)
        else if (totalBudget > 0 && currentExpense > totalBudget * 0.8) {
          alertTriggered = true;
          alertMessage = `Warning: You have used ${((currentExpense / totalBudget) * 100).toFixed(0)}% of your monthly budget.`;
          alertType = 'warning';
        }

        if (alertTriggered) {
          // Check if we already sent this exact alert type recently so we don't spam
          const recentAlert = await Notification.findOne({
            user: req.user.id,
            type: alertType,
            message: alertMessage,
            createdAt: { $gte: startOfCurrentMonth }
          });

          if (!recentAlert) {
            await Notification.create({
              user: req.user.id,
              title: alertType === 'alert' ? 'Overspending / Budget Exceeded' : 'Budget Warning',
              message: alertMessage,
              type: alertType,
            });

            // Send Email
            const user = await User.findById(req.user.id);
            if (user) {
              await sendEmail({
                email: user.email,
                subject: alertType === 'alert' ? '🚨 SpendWise: Critical Alert' : '⚠️ SpendWise: Budget Warning',
                message: alertMessage,
                html: `<div style="font-family:sans-serif;padding:20px;border-radius:10px;background:#f9fafb;">
                        <h2 style="color:${alertType === 'alert' ? '#dc2626' : '#d97706'}">${alertType === 'alert' ? 'Critical Alert' : 'Budget Warning'}</h2>
                        <p style="font-size:16px;">${alertMessage}</p>
                        <p>Keep track of your finances in your <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">SpendWise Dashboard</a>.</p>
                       </div>`
              }).catch(err => console.log('Email sending failed:', err));
            }
          }
        }
      } catch (err) {
        console.log('Error triggering alert:', err);
      }
    }

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
