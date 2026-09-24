import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequirementsService } from '../services/userRequirementsService';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const preferencesSchema = z.object({
  low_premium: z.boolean().optional(),
  high_coverage: z.boolean().optional(),
  low_waiting_period: z.boolean().optional(),
  no_copay: z.boolean().optional(),
  maternity: z.boolean().optional(),
  restoration: z.boolean().optional()
}).optional();

const requirementProfileSchema = z.object({
  age: z.number().int().min(18).max(100).optional(),
  city: z.string().min(2).max(100).optional(),
  family_members_count: z.number().int().min(1).max(10).optional(),
  budget_max: z.number().min(5000).max(500000).optional(),
  sum_insured_target: z.number().min(300000).max(50000000).optional(),
  max_acceptable_waiting_months: z.number().int().min(0).max(48).optional(),
  pre_existing_conditions: z.array(z.string()).optional(),
  preferences: preferencesSchema
});

// 1. Get Stored User Requirements
router.get('/', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_demo_01';
  const profile = UserRequirementsService.getRequirements(userId);
  res.json({ success: true, data: profile });
});

// 2. Save User Requirements (Create/Replace)
router.post('/', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = requirementProfileSchema.parse(req.body);
    const userId = req.user?.id || 'usr_demo_01';
    const saved = UserRequirementsService.saveRequirements(userId, validated);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(400).json({ error: err.message || 'Failed to save requirements' });
  }
});

// 3. Update Partial Requirements
router.put('/', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = requirementProfileSchema.partial().parse(req.body);
    const userId = req.user?.id || 'usr_demo_01';
    const updated = UserRequirementsService.updateRequirements(userId, validated);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(400).json({ error: err.message || 'Failed to update requirements' });
  }
});

// 4. Delete / Clear Requirements (Privacy compliance)
router.delete('/', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_demo_01';
  UserRequirementsService.clearRequirements(userId);
  res.json({ success: true, message: 'User requirements profile cleared successfully' });
});

export default router;
