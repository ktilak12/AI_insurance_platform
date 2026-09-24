import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Validation Schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name is required'),
  role: z.enum(['consumer', 'broker']).optional().default('consumer')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

const oauthSchema = z.object({
  provider: z.enum(['google', 'github']),
  providerUserId: z.string().min(1),
  email: z.string().email(),
  fullName: z.string()
});

// 1. Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const validated = signupSchema.parse(req.body);
    const result = await AuthService.signup(
      validated.email,
      validated.password,
      validated.fullName,
      validated.role
    );
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
});

// 2. Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await AuthService.login(validated.email, validated.password);
    res.json({ success: true, data: result });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(401).json({ error: err.message || 'Authentication failed' });
  }
});

// 3. Token Refresh (with rotation)
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const validated = refreshSchema.parse(req.body);
    const result = AuthService.refreshAccessToken(validated.refreshToken);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Token refresh failed' });
  }
});

// 4. Logout
router.post('/logout', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    AuthService.revokeRefreshToken(refreshToken);
  }
  res.json({ success: true, message: 'Successfully logged out' });
});

// 5. Get Current User Profile (Protected)
router.get('/me', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = AuthService.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// 6. OAuth Handshake
router.post('/oauth', async (req: Request, res: Response) => {
  try {
    const validated = oauthSchema.parse(req.body);
    const result = await AuthService.handleOAuthLogin(
      validated.provider,
      validated.providerUserId,
      validated.email,
      validated.fullName
    );
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'OAuth authentication failed' });
  }
});

export default router;
