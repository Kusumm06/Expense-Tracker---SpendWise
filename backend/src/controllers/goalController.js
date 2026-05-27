import Goal from '../models/Goal.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, color } = req.body;
    const goal = await Goal.create({
      user: req.user.id,
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      color,
    });
    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal || goal.user.toString() !== req.user.id) {
      res.status(404);
      throw new Error('Goal not found');
    }

    const wasCompleted = goal.status === 'completed';
    
    // Check if newly completed
    if (req.body.currentAmount >= goal.targetAmount && !wasCompleted) {
      req.body.status = 'completed';
      req.body.currentAmount = goal.targetAmount; // Cap at target
    } else if (req.body.currentAmount < goal.targetAmount) {
      req.body.status = 'active';
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If status changed to completed, trigger notifications
    if (goal.status === 'completed' && !wasCompleted) {
      const user = await User.findById(req.user.id);
      
      // In-app notification
      await Notification.create({
        user: req.user.id,
        title: 'Goal Achieved! 🎉',
        message: `Congratulations! You completed your ${goal.title} goal.`,
        type: 'success'
      });

      // Email notification
      if (user) {
        try {
          await sendEmail({
            email: user.email,
            subject: 'Goal Achieved! 🎉',
            message: `Congratulations! You completed your ${goal.title} goal.`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10B981;">Congratulations! 🎉</h2>
                    <p>You have successfully completed your savings goal: <strong>${goal.title}</strong>.</p>
                    <p>You reached your target of ₹${goal.targetAmount.toLocaleString()}!</p>
                    <p>Log in to SpendWise to celebrate and set your next big goal.</p>
                   </div>`
          });
        } catch (err) {
          console.error("Failed to send goal completion email:", err);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: goal,
      newlyCompleted: goal.status === 'completed' && !wasCompleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal || goal.user.toString() !== req.user.id) {
      res.status(404);
      throw new Error('Goal not found');
    }
    await goal.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
