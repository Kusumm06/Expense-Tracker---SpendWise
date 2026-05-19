import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// @desc    Get summary (balance, income, expenses)
// @route   GET /api/analytics/summary
// @access  Private
export const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else if (t.type === 'expense') {
        totalExpense += t.amount;
      }
    });

    const totalBalance = totalIncome - totalExpense;

    // To calculate monthly growth, we need previous month's data. 
    // For simplicity in this demo, we'll return static growth % or calculate basic if needed.
    // Let's just return the totals for now.
    
    res.status(200).json({
      success: true,
      data: {
        totalBalance,
        totalIncome,
        totalExpense,
        netSavings: totalBalance, // Can be refined
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get category stats (for donut chart)
// @route   GET /api/analytics/categories
// @access  Private
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), type: 'expense' } },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      { $sort: { totalAmount: -1 } }
    ]);

    const formattedStats = stats.map(stat => ({
      category: stat._id,
      amount: stat.totalAmount
    }));

    res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly expense trends (for line chart)
// @route   GET /api/analytics/trends
// @access  Private
export const getTrends = async (req, res) => {
  try {
    // Group by month
    const trends = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), type: 'expense' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } } // Sort chronologically
    ]);

    const formattedTrends = trends.map(t => ({
      date: t._id, // e.g. "2023-10"
      amount: t.totalAmount
    }));

    res.status(200).json({
      success: true,
      data: formattedTrends,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
