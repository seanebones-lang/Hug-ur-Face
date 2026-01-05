export interface PasswordValidationResult {
  valid: boolean;
  error?: string;
}

const COMMON_PASSWORDS = [
  'password', 'password123', '12345678', 'admin123', 'letmein',
  'qwerty', '123456789', 'welcome', 'monkey', 'dragon'
];

export function validatePassword(password: string): PasswordValidationResult {
  // Minimum length
  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters long"
    };
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter"
    };
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter"
    };
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one number"
    };
  }

  // Check against common passwords
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common))) {
    return {
      valid: false,
      error: "Password is too common. Please choose a stronger password."
    };
  }

  // Check for repeated characters (e.g., "aaaa")
  if (/(.)\1{3,}/.test(password)) {
    return {
      valid: false,
      error: "Password contains too many repeated characters"
    };
  }

  return { valid: true };
}
