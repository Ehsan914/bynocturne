import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// uploads folder is one level up from src folder: server/uploads
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Check path being served
console.log('📁 Serving static files from:', uploadsPath);


// Root route
app.get('/', (req, res) => {
  res.send('E-commerce backend is running');
});

// Product routes
app.use('/api/products', productRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/auth', authRoutes);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});