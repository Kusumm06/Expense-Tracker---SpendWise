import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";

dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});