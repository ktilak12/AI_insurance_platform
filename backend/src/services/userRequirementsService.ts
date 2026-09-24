import { UserRequirementProfile } from '../types/policy';

export class UserRequirementsService {
  // In-memory requirements store (userId -> UserRequirementProfile)
  private static userProfiles: Map<string, UserRequirementProfile> = new Map([
    [
      'usr_demo_01',
      {
        age: 32,
        city: 'Bengaluru',
        family_members_count: 2,
        budget_max: 20000,
        sum_insured_target: 1000000,
        max_acceptable_waiting_months: 36,
        pre_existing_conditions: [],
        preferences: {
          no_copay: true,
          maternity: false,
          restoration: true,
          low_waiting_period: true
        }
      }
    ]
  ]);

  public static getRequirements(userId: string): UserRequirementProfile {
    return (
      this.userProfiles.get(userId) || {
        age: 30,
        city: 'Bengaluru',
        family_members_count: 1,
        budget_max: 25000,
        sum_insured_target: 1000000,
        max_acceptable_waiting_months: 36,
        pre_existing_conditions: [],
        preferences: {
          no_copay: true,
          maternity: false,
          restoration: true
        }
      }
    );
  }

  public static saveRequirements(
    userId: string, 
    profile: UserRequirementProfile
  ): UserRequirementProfile {
    this.userProfiles.set(userId, profile);
    return profile;
  }

  public static updateRequirements(
    userId: string,
    partial: Partial<UserRequirementProfile>
  ): UserRequirementProfile {
    const existing = this.getRequirements(userId);
    const updated: UserRequirementProfile = {
      ...existing,
      ...partial,
      preferences: {
        ...existing.preferences,
        ...partial.preferences
      }
    };
    this.userProfiles.set(userId, updated);
    return updated;
  }

  public static clearRequirements(userId: string): boolean {
    return this.userProfiles.delete(userId);
  }
}
