import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the expense'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    receipt: {
      type: String,
      // Receipt is optional as requested
      default: null,
    },
    transactionDate: {
      type: Date,
      required: [true, 'Please add a transaction date'],
      default: Date.now,
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

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
