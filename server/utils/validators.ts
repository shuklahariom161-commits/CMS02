export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isCollegeEmail = (email: string, domain?: string): boolean => {
  const collegeDomain = domain || process.env.COLLEGE_EMAIL_DOMAIN || 'college.edu';
  if (!isValidEmail(email)) return false;
  return email.toLowerCase().endsWith(`@${collegeDomain.toLowerCase()}`);
};

export const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
  if (!password || password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};
