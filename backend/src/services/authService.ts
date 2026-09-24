import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_prod';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_change_in_prod';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'consumer' | 'broker' | 'admin';
  createdAt: string;
}

export class AuthService {
  // In-memory user store for rapid dev and testing, compatible with PostgreSQL
  private static users: Map<string, User> = new Map([
    [
      'demo@policylens.ai',
      {
        id: 'usr_demo_01',
        email: 'demo@policylens.ai',
        passwordHash: bcrypt.hashSync('PolicyLens@2026', 10),
        fullName: 'Demo Policyholder',
        role: 'consumer',
        createdAt: new Date().toISOString()
      }
    ]
  ]);

  // Active refresh tokens store (token -> userId)
  private static refreshTokens: Set<string> = new Set();

  public static async signup(
    email: string, 
    password: string, 
    fullName: string, 
    role: 'consumer' | 'broker' = 'consumer'
  ): Promise<{ user: Omit<User, 'passwordHash'>; accessToken: string; refreshToken: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.users.has(normalizedEmail)) {
      throw new Error('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;

    const newUser: User = {
      id,
      email: normalizedEmail,
      passwordHash,
      fullName,
      role,
      createdAt: new Date().toISOString()
    };

    this.users.set(normalizedEmail, newUser);

    const tokens = this.generateTokens(newUser);
    this.refreshTokens.add(tokens.refreshToken);

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  public static async login(
    email: string, 
    password: string
  ): Promise<{ user: Omit<User, 'passwordHash'>; accessToken: string; refreshToken: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = this.users.get(normalizedEmail);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const tokens = this.generateTokens(user);
    this.refreshTokens.add(tokens.refreshToken);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  public static refreshAccessToken(refreshToken: string): { accessToken: string; newRefreshToken: string } {
    if (!this.refreshTokens.has(refreshToken)) {
      throw new Error('Refresh token is invalid or has been revoked.');
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; email: string; role: string };
      
      // Token rotation: revoke old token and issue new pair
      this.refreshTokens.delete(refreshToken);

      const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
      const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      this.refreshTokens.add(newRefreshToken);

      return { accessToken: newAccessToken, newRefreshToken };
    } catch (err) {
      this.refreshTokens.delete(refreshToken);
      throw new Error('Expired or malformed refresh token.');
    }
  }

  public static revokeRefreshToken(refreshToken: string): void {
    this.refreshTokens.delete(refreshToken);
  }

  public static getUserById(userId: string): Omit<User, 'passwordHash'> | null {
    for (const u of this.users.values()) {
      if (u.id === userId) {
        const { passwordHash: _, ...userWithoutPassword } = u;
        return userWithoutPassword;
      }
    }
    return null;
  }

  public static async handleOAuthLogin(
    provider: 'google' | 'github',
    providerUserId: string,
    email: string,
    fullName: string
  ): Promise<{ user: Omit<User, 'passwordHash'>; accessToken: string; refreshToken: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    let user = this.users.get(normalizedEmail);

    if (!user) {
      const id = `usr_oauth_${provider}_${providerUserId}`;
      user = {
        id,
        email: normalizedEmail,
        passwordHash: '',
        fullName,
        role: 'consumer',
        createdAt: new Date().toISOString()
      };
      this.users.set(normalizedEmail, user);
    }

    const tokens = this.generateTokens(user);
    this.refreshTokens.add(tokens.refreshToken);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  private static generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
