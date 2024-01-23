import express from 'express';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import booksRoutes from './routes/books.js';
import authRoutes from './routes/authLogin.js';
import fs from 'fs';
import sequelize from './db/sequelize.js';

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

// Check database connection
try {
  await sequelize.authenticate();
  console.log('Connection to the database has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1); // Exit the process if unable to connect to the database
}

// Sync models with the database and start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});