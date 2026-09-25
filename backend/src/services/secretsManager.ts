import dotenv from 'dotenv';

dotenv.config();

export interface AppSecrets {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  INTERNAL_API_SECRET: string;
  GEMINI_API_KEY?: string;
  B2B_HMAC_MASTER_KEY?: string;
  AWS_REGION?: string;
}

export class SecretsManagerService {
  private static cachedSecrets: AppSecrets | null = null;
  private static lastFetched: number = 0;
  private static readonly TTL_MS = 15 * 60 * 1000; // 15-minute secret rotation cache

  /**
   * Retrieves secrets from AWS Secrets Manager in production,
   * falling back to validated local environment variables in dev/test.
   */
  public static async getSecrets(): Promise<AppSecrets> {
    const now = Date.now();
    if (this.cachedSecrets && now - this.lastFetched < this.TTL_MS) {
      return this.cachedSecrets;
    }

    const secretVaultName = process.env.AWS_SECRETS_VAULT_NAME;
    const isAwsVaultConfigured = !!secretVaultName && process.env.NODE_ENV === 'production';

    if (isAwsVaultConfigured) {
      try {
        // Dynamically load AWS SDK in production environments
        const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
        const client = new SecretsManagerClient({
          region: process.env.AWS_REGION || 'ap-south-1'
        });

        const command = new GetSecretValueCommand({
          SecretId: secretVaultName
        });

        const response = await client.send(command);
        if (response.SecretString) {
          const parsed = JSON.parse(response.SecretString) as AppSecrets;
          this.validateSecretPayload(parsed);
          this.cachedSecrets = parsed;
          this.lastFetched = now;
          console.log(`[SecretsManager] Successfully refreshed credentials from AWS Secrets Manager (${secretVaultName}).`);
          return this.cachedSecrets;
        }
      } catch (err: any) {
        console.warn(`[SecretsManager] Failed to fetch from AWS Secrets Manager (${err.message}). Falling back to local environment variables.`);
      }
    }

    // Local / Container Environment Variables Fallback
    const localSecrets: AppSecrets = {
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/insurance_db',
      JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_minimum_32_characters_long_for_security',
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_minimum_32_characters_long',
      INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET || 'dev_internal_api_secret_64_characters_long_key_change_in_prod',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      B2B_HMAC_MASTER_KEY: process.env.B2B_HMAC_MASTER_KEY || 'dev_b2b_hmac_master_signature_key',
      AWS_REGION: process.env.AWS_REGION || 'ap-south-1'
    };

    this.cachedSecrets = localSecrets;
    this.lastFetched = now;
    return this.cachedSecrets;
  }

  /**
   * Synchronous helper for fast access after initial bootstrap.
   */
  public static getLoadedSecrets(): AppSecrets {
    if (!this.cachedSecrets) {
      return {
        DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/insurance_db',
        JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_minimum_32_characters_long_for_security',
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_minimum_32_characters_long',
        INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET || 'dev_internal_api_secret_64_characters_long_key_change_in_prod',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        B2B_HMAC_MASTER_KEY: process.env.B2B_HMAC_MASTER_KEY || 'dev_b2b_hmac_master_signature_key',
        AWS_REGION: process.env.AWS_REGION || 'ap-south-1'
      };
    }
    return this.cachedSecrets;
  }

  private static validateSecretPayload(secrets: AppSecrets): void {
    const requiredKeys: (keyof AppSecrets)[] = [
      'DATABASE_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'INTERNAL_API_SECRET'
    ];

    for (const key of requiredKeys) {
      if (!secrets[key] || typeof secrets[key] !== 'string') {
        throw new Error(`[SecretsManager] Missing required secret key in vault payload: ${key}`);
      }
    }
  }
}
