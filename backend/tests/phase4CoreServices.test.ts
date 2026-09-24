import { AuthService } from '../src/services/authService';
import { UserRequirementsService } from '../src/services/userRequirementsService';
import { ComparisonEngine } from '../src/services/comparisonEngine';
import { AIGatewayService } from '../src/services/aiGatewayService';
import { InsurancePolicy, UserRequirementProfile } from '../src/types/policy';

describe('Phase 4: Core Backend Services Test Suite', () => {

  // 4.1 Authentication Tests
  describe('4.1 Authentication Service', () => {
    const testEmail = `test_${Date.now()}@policylens.ai`;
    const password = 'SecurePassword@123';

    test('should successfully signup a new user and return JWT tokens', async () => {
      const res = await AuthService.signup(testEmail, password, 'John Doe', 'consumer');
      expect(res.user.email).toBe(testEmail);
      expect(res.accessToken).toBeDefined();
      expect(res.refreshToken).toBeDefined();
    });

    test('should prevent duplicate signup with same email', async () => {
      await expect(AuthService.signup(testEmail, password, 'John Doe')).rejects.toThrow(
        'User with this email already exists.'
      );
    });

    test('should successfully login with valid credentials', async () => {
      const res = await AuthService.login(testEmail, password);
      expect(res.user.email).toBe(testEmail);
      expect(res.accessToken).toBeDefined();
    });

    test('should reject login with wrong password', async () => {
      await expect(AuthService.login(testEmail, 'WrongPassword123')).rejects.toThrow(
        'Invalid email or password.'
      );
    });

    test('should refresh token and rotate refresh tokens', async () => {
      const loginRes = await AuthService.login(testEmail, password);
      const refreshRes = AuthService.refreshAccessToken(loginRes.refreshToken);

      expect(refreshRes.accessToken).toBeDefined();
      expect(refreshRes.newRefreshToken).toBeDefined();

      // Old token should be invalidated/rotated
      expect(() => AuthService.refreshAccessToken(loginRes.refreshToken)).toThrow();
    });
  });

  // 4.2 User Requirements Service Tests
  describe('4.2 User Requirements API', () => {
    const userId = `usr_test_${Date.now()}`;

    test('should save and retrieve user requirement profile', () => {
      const profile: UserRequirementProfile = {
        age: 35,
        city: 'Mumbai',
        family_members_count: 3,
        budget_max: 30000,
        sum_insured_target: 1500000,
        max_acceptable_waiting_months: 24,
        pre_existing_conditions: ['Hypertension'],
        preferences: {
          no_copay: true,
          maternity: false,
          restoration: true
        }
      };

      const saved = UserRequirementsService.saveRequirements(userId, profile);
      expect(saved.city).toBe('Mumbai');

      const retrieved = UserRequirementsService.getRequirements(userId);
      expect(retrieved.sum_insured_target).toBe(1500000);
      expect(retrieved.pre_existing_conditions).toContain('Hypertension');
    });

    test('should update partial requirements', () => {
      const updated = UserRequirementsService.updateRequirements(userId, {
        budget_max: 35000
      });
      expect(updated.budget_max).toBe(35000);
      expect(updated.city).toBe('Mumbai'); // Preserves other fields
    });
  });

  // 4.3 Plan Comparison Engine Tests
  describe('4.3 Plan Comparison Engine (Fit Analysis)', () => {
    const samplePolicy: InsurancePolicy = {
      provider: 'HDFC ERGO',
      plan_name: 'Optima Secure',
      category: 'health',
      premium: 15000,
      sum_insured: 1000000,
      policy_term_years: 1,
      room_rent: { type: 'no_capping', limit_amount: null, limit_percentage: null },
      waiting_period_months: { initial: 30, specific_disease: 24, pre_existing: 24 },
      copayment_percentage: 0,
      deductible_amount: 0,
      restoration_benefit: true,
      no_claim_bonus_percentage: 100,
      maternity_covered: false,
      daycare_treatments_covered: true,
      pre_hospitalization_days: 60,
      post_hospitalization_days: 180,
      exclusions: ['Cosmetic surgery'],
      sub_limits: [],
      source_metadata: {
        document_name: 'optima.pdf',
        document_hash: 'hash123',
        extracted_at: '2026-01-01',
        confidence_score: 0.98,
        page_provenance: {}
      }
    };

    test('calculates 100% fit score for matching criteria', () => {
      const req: UserRequirementProfile = {
        budget_max: 20000,
        sum_insured_target: 1000000,
        max_acceptable_waiting_months: 24,
        preferences: {
          no_copay: true,
          restoration: true
        }
      };

      const fit = ComparisonEngine.calculateFit(samplePolicy, req);
      expect(fit.overall_fit_percentage).toBe(100);
      expect(fit.breakdown.budget_fit).toBe(true);
      expect(fit.breakdown.coverage_fit).toBe(true);
      expect(fit.breakdown.waiting_period_fit).toBe(true);
      expect(fit.breakdown.copay_fit).toBe(true);
    });

    test('penalizes policies exceeding user budget and emits warning', () => {
      const tightBudgetReq: UserRequirementProfile = {
        budget_max: 10000, // Premium is 15000 (50% over budget)
        sum_insured_target: 1000000
      };

      const fit = ComparisonEngine.calculateFit(samplePolicy, tightBudgetReq);
      expect(fit.breakdown.budget_fit).toBe('warning');
      expect(fit.overall_fit_percentage).toBeLessThan(100);
      expect(fit.explanation_points.some(p => p.includes('exceeds your budget'))).toBe(true);
    });

    test('penalizes room rent capping to avoid proportionate deduction penalty', () => {
      const cappedPolicy: InsurancePolicy = {
        ...samplePolicy,
        room_rent: { type: 'fixed_amount', limit_amount: 5000, limit_percentage: null }
      };

      const fit = ComparisonEngine.calculateFit(cappedPolicy, {
        budget_max: 20000,
        sum_insured_target: 1000000
      });

      expect(fit.overall_fit_percentage).toBeLessThan(100);
      expect(fit.explanation_points.some(p => p.includes('proportionate claim deductions'))).toBe(true);
    });
  });

  // 4.4 API Gateway Service Tests
  describe('4.4 Secure AI Gateway Service', () => {
    test('checkHealth returns gateway status structure', async () => {
      const health = await AIGatewayService.checkHealth();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('url');
    });

    test('askPolicy provides grounded fallback response if service is offline', async () => {
      const response = await AIGatewayService.askPolicy('What is the waiting period?', 'care-supreme');
      expect(response.is_grounded).toBe(true);
      expect(response.citations.length).toBeGreaterThan(0);
      expect(response.citations[0].page_number).toBeGreaterThan(0);
    });
  });
});
