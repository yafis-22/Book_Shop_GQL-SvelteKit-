import express from 'express';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import booksRoutes from './routes/books.js';
import authRoutes from './routes/authLogin.js';
import fs from 'fs';

const app = express();

// Read the configuration from JSON file
const configFile = 'config.json';
const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
const PORT = config.PORT;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use(`/api/${config.API_VERSION}/admins`, adminRoutes);
app.use(`/api/${config.API_VERSION}/users`, userRoutes);
app.use(`/api/${config.API_VERSION}/books`, booksRoutes);
app.use(`/api/${config.API_VERSION}/login`, authRoutes);


// Server to listen at port 3002
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });