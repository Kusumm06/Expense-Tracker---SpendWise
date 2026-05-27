import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import mongoose from 'mongoose';

// @desc    Get aggregated report data
// @route   GET /api/reports
// @access  Private
export const getReportData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.query; // 'this_week', 'this_month', 'last_month', 'this_year', 'all_time'

    const now = new Date();
    let startDate = new Date(0); // Epoch
    let endDate = new Date();

    if (period === 'this_week') {
      const day = now.getDay() || 7; // Get current day number, making Sunday (0) = 7
      if (day !== 1) now.setHours(-24 * (day - 1)); // Adjust to Monday
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'this_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'last_month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === 'this_year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const dateFilter = { date: { $gte: startDate, $lte: endDate } };

    // 1. Raw Transactions
    const transactions = await Transaction.find({ user: userId, ...dateFilter }).sort({ date: -1 });

    // 2. Summary (Income, Expenses, Savings)
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else if (t.type === 'expense') totalExpense += t.amount;
    });
    const totalSavings = totalIncome - totalExpense;

    // 3. Budgets
    // Since budgets are stored as 'YYYY-MM', let's just grab the current month budget for simplicity unless period is last_month
    let targetMonth = new Date();
    if (period === 'last_month') {
      targetMonth.setMonth(targetMonth.getMonth() - 1);
    }
    const monthStr = `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`;
    const budgets = await Budget.find({ user: userId, month: monthStr });
    const totalBudget = budgets.reduce((acc, b) => acc + b.limitAmount, 0);

    // 4. Category Breakdown
    const catStats = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), type: 'expense', ...dateFilter } },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      { $sort: { totalAmount: -1 } }
    ]);
    const categories = catStats.map(stat => ({
      category: stat._id,
      amount: stat.totalAmount,
      percentage: totalExpense > 0 ? ((stat.totalAmount / totalExpense) * 100).toFixed(1) : 0
    }));

    // 5. Monthly Trends (Income vs Expense over time)
    // Group by Date String for charts
    const trends = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), ...dateFilter } },
      {
        $group: {
          _id: {
            dateStr: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type"
          },
          totalAmount: { $sum: '$amount' },
          dateRaw: { $first: "$date" }
        }
      },
      {
        $group: {
          _id: "$_id.dateStr",
          income: { $sum: { $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0] } },
          expense: { $sum: { $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0] } },
          dateRaw: { $first: "$dateRaw" }
        }
      },
      { $sort: { dateRaw: 1 } }
    ]);

    const formattedTrends = trends.map(t => ({
      date: t._id, // Will format properly in frontend
      income: t.income,
      expense: t.expense
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          totalSavings,
          totalBudget,
        },
        categories,
        trends: formattedTrends,
        transactions,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
