import express from 'express';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);


// Server to listen at port 3002
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });