import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the goal'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please add a target amount'],
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: false,
    },
    color: {
      type: String,
      default: '#10B981', // Default green
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
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

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
