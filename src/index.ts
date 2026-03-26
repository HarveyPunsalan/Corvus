import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Load .env variables before anything else reads process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── GLOBAL MIDDLEWARE ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── ROUTES ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running!' });
});

// ── GLOBAL ERROR HANDLER ───────────────────────────────────────
// Must be registered LAST — after all routes
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});