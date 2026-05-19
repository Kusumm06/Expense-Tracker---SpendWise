import Budget from '../models/Budget.js';

// @desc    Get all budgets for current user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const { month } = req.query; // optional filter
    const query = { user: req.user.id };
    if (month) query.month = month;

    const budgets = await Budget.find(query).sort({ category: 1 });
    res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
export const createOrUpdateBudget = async (req, res) => {
  try {
    const { category, limitAmount, month } = req.body;
    
    // Check if budget exists for this category and month
    let budget = await Budget.findOne({ user: req.user.id, category, month });

    if (budget) {
      budget.limitAmount = limitAmount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user.id,
        category,
        limitAmount,
        month,
      });
    }

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget || budget.user.toString() !== req.user.id) {
      res.status(404);
      throw new Error('Budget not found');
    }
    await budget.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
