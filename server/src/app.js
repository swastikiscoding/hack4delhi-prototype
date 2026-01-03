import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiResponse } from './utils/ApiResponse.js';
import { voterRouter } from './routes/voter.route.js';

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

app.get('/', (req, res) => {
  res.json(new ApiResponse(200, {}, 'API is running successfully'));
});

export {app};