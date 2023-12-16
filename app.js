import express from 'express';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import booksRoutes from './routes/books.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use(`/api/${process.env.API_VERSION}/admin`, adminRoutes);
app.use(`/api/${process.env.API_VERSION}/user`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/books`, booksRoutes);
app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);


// Server to listen at port 3002
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });