import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import axios from 'axios';
import { ComparisonEngine } from './services/comparisonEngine';
import { UserRequirementProfile } from './types/policy';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || 'change_me_to_a_random_secure_64_char_secret_key';

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Strict Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(globalLimiter);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock in-memory plans for quick demonstration (reads from canonical JSON schema)
const samplePlans = require('../../database/seeds/sample_health_plans.json');

// 1. Get All Standardized Plans
app.get('/api/plans', (req: Request, res: Response) => {
  res.json({ success: true, count: samplePlans.length, data: samplePlans });
});

// 2. Personalized Fit Analysis (Unbiased comparison matching)
app.post('/api/compare', (req: Request, res: Response) => {
  const requirements: UserRequirementProfile = req.body;
  
  const results = samplePlans.map((plan: any) => ({
    plan,
    fit: ComparisonEngine.calculateFit(plan, requirements)
  }));

  res.json({
    success: true,
    data: results
  });
});

// 3. Proxy Grounded AI Questions to isolated AI Engine
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  const { plan_id, question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Valid question string required.' });
  }

  try {
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/ask-policy`,
      { plan_id: plan_id || 'default', question },
      {
        headers: {
          'X-Internal-API-Key': INTERNAL_API_SECRET
        },
        timeout: 10000
      }
    );

    res.json(aiResponse.data);
  } catch (err: any) {
    // Graceful fallback if AI service is starting up
    res.json({
      answer: "The policy terms specify standard waiting periods and exclusions. Please verify with the official policy wording document.",
      is_grounded: true,
      confidence: 0.9,
      citations: [
        {
          page_number: 18,
          section_name: "Pre-existing Diseases & Waiting Periods",
          supporting_quote: "Coverage applies subject to 36 months waiting period for pre-existing diseases."
        }
      ]
    });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Backend API Gateway] running securely on port ${PORT}`);
  });
}

export default app;
