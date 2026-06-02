import express from 'express';
import cors from 'cors';
import routes from './routes';
import { getDb } from './db';

console.log('Starting index.ts...');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api', routes);

// Initialize DB and start server
async function start() {
  try {
    await getDb();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
