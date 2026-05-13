import express from 'express';
import cors from 'cors';
import parcelRoutes from './routes/parcelRoutes';
import { getTileByKey } from './controllers/parcelController';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/v1/parcels', parcelRoutes);
app.get('/v1/tiles/:z/:x/:y.json', getTileByKey);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
