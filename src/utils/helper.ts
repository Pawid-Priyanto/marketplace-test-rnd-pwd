// Regex: Min 8 chars, min 1 uppercase letter, min 1 number, min 1 special character
const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// Regex Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string) => {
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null; 
};

export const validatePassword = (password: string) => {
  if (!strongPasswordRegex.test(password)) {
    return 'Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character.';
  }
  return null; 
};

export function formatRupiah(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
