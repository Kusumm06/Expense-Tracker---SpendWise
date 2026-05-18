# Expense Tracker Backend

A complete backend for a MERN stack Expense Tracker application.

## Tech Stack
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- JWT Authentication & bcryptjs
- Cloudinary & Multer for image uploads

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` or just fill in the `.env` file with your credentials.
   - Add your MongoDB URI.
   - Add your Cloudinary credentials.
   - Set a JWT Secret.

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged-in user

### Expenses
- `POST /api/expenses` - Create a new expense (supports form-data for image upload)
- `GET /api/expenses` - Get all expenses for logged-in user
- `GET /api/expenses/:id` - Get specific expense
- `PUT /api/expenses/:id` - Update specific expense
- `DELETE /api/expenses/:id` - Delete specific expense

## Testing with Postman

1. **Register**: Send a `POST` request to `/api/auth/register` with JSON body:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```
2. **Login**: Send a `POST` request to `/api/auth/login` with JSON body. Copy the returned `token`.
3. **Add Expense**: 
   - Change request to `POST /api/expenses`
   - In Headers, add `Authorization: Bearer <your_token>`
   - In Body, select `form-data`
   - Add keys: `title`, `amount`, `category`, and optionally `receipt` (change type to File and select an image).
