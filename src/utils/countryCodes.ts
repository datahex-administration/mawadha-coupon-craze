
import { CountryCode } from '../types';

export const countryCodes: CountryCode[] = [
  { code: '+971', country: 'UAE', regex: /^[0-9]{9}$/, format: 'XX XXX XXXX' },
  { code: '+966', country: 'Saudi Arabia', regex: /^[0-9]{9}$/, format: 'XX XXX XXXX' },
  { code: '+973', country: 'Bahrain', regex: /^[0-9]{8}$/, format: 'XXXX XXXX' },
  { code: '+974', country: 'Qatar', regex: /^[0-9]{8}$/, format: 'XXXX XXXX' },
  { code: '+965', country: 'Kuwait', regex: /^[0-9]{8}$/, format: 'XXXX XXXX' },
  { code: '+968', country: 'Oman', regex: /^[0-9]{8}$/, format: 'XXXX XXXX' },
  { code: '+91', country: 'India', regex: /^[0-9]{10}$/, format: 'XXXXX XXXXX' },
];

export const validatePhoneNumber = (phoneNumber: string, countryCode: string): boolean => {
  const country = countryCodes.find(c => c.code === countryCode);
  if (!country) return false;
  
  if (typeof country.regex === 'string') {
    return new RegExp(country.regex).test(phoneNumber);
  } else {
    return country.regex.test(phoneNumber);
  }
};

export const generateCouponCode = (name: string): string => {
  const namePrefix = name.substring(0, 2).toUpperCase();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const timestamp = Date.now().toString().substring(10);
  return `${namePrefix}${randomNum}${timestamp}`;
};
