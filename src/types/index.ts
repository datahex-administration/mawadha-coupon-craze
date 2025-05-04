
export interface User {
  id?: string;
  name: string;
  whatsapp: string;
  countryCode: string;
  age: number;
  maritalStatus: 'Single' | 'Engaged' | 'Married';
  attractionReason: string;
  couponCode: string;
  createdAt?: string;
}

export interface CountryCode {
  code: string;
  country: string;
  regex: RegExp | string;
  format: string;
}
