import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiResponse } from './utils/ApiResponse.js';
import { voterRouter } from './routes/voter.route.js';
import { blockchainRouter } from './routes/blockchain.route.js';
import { transferRouter } from './routes/transfer.route.js';
import { metaRouter } from './routes/meta.route.js';
import { uploadRouter } from './routes/upload.route.js';
import { stateECRouter } from './routes/stateec.route.js';
import { eciRouter } from './routes/eci.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/v1/voters', voterRouter);
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/transfers', transferRouter);
app.use('/api/v1/meta', metaRouter);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/state-ec', stateECRouter);
app.use('/api/v1/eci', eciRouter);

app.get('/', (req, res) => {
  res.json(new ApiResponse(200, {}, 'API is running successfully'));
});

export {app};