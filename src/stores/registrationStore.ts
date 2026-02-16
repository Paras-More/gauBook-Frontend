import { create } from 'zustand';

export type UserRole = 'gaushala' | 'ngo' | 'volunteer' | 'donor' | 'influencer' | 'vendor';

export type FormType = 'type1' | 'type2' | 'type3';

export const getRoleFormType = (role: UserRole): FormType => {
  if (role === 'gaushala' || role === 'ngo') return 'type1';
  if (role === 'volunteer' || role === 'donor' || role === 'influencer') return 'type2';
  return 'type3';
};

export const roleLabels: Record<UserRole, string> = {
  gaushala: 'Gaushala',
  ngo: 'NGO',
  volunteer: 'Volunteer',
  donor: 'Donor',
  influencer: 'Influencer',
  vendor: 'Vendor',
};

export const roleDescriptions: Record<UserRole, string> = {
  gaushala: 'Register your Gaushala and join India\'s largest verified directory',
  ngo: 'Register your NGO and support Gau welfare programs',
  volunteer: 'Volunteer your time and skills to support Gaushalas',
  donor: 'Discover and support Gaushalas through donations',
  influencer: 'Use your reach to promote Gau Seva and awareness',
  vendor: 'List your products and services for Gaushalas',
};

export const roleIcons: Record<UserRole, string> = {
  gaushala: '🏠',
  ngo: '🤝',
  volunteer: '🙋',
  donor: '💝',
  influencer: '📢',
  vendor: '🏪',
};

interface RegistrationState {
  selectedRole: UserRole | null;
  currentStep: number;
  formData: Record<string, any>;
  setSelectedRole: (role: UserRole) => void;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Record<string, any>) => void;
  resetForm: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  selectedRole: null,
  currentStep: 0,
  formData: {},
  setSelectedRole: (role) => set({ selectedRole: role, currentStep: 1, formData: {} }),
  setCurrentStep: (step) => set({ currentStep: step }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () => set({ selectedRole: null, currentStep: 0, formData: {} }),
}));
