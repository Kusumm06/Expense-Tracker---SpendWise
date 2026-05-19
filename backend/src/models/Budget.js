import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    limitAmount: {
      type: Number,
      required: [true, 'Please add a budget limit'],
    },
    month: {
      type: String, // format: "YYYY-MM"
      required: [true, 'Please specify the month'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user should only have one budget per category per month
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
