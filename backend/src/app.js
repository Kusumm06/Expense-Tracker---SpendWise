import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Expense Tracker API is running...");
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;