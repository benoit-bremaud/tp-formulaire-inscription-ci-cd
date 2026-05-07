import { calculateAge, isAdult, isValidEmail, isValidName, isValidPostalCode } from './validators';

describe('calculateAge', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-05T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns 0 when the birth date is today', () => {
    const today = new Date('2026-05-05T00:00:00Z');
    expect(calculateAge(today)).toBe(0);
  });

  test('returns 25 when the user was born exactly 25 years ago', () => {
    const birth = new Date('2001-05-05T00:00:00Z');
    expect(calculateAge(birth)).toBe(25);
  });
  test('throws when birthDate is not a Date', () => {
    expect(() => calculateAge(undefined)).toThrow('birthDate must be a Date');
    expect(() => calculateAge('1990-01-01')).toThrow('birthDate must be a Date');
    expect(() => calculateAge(null)).toThrow('birthDate must be a Date');
    expect(() => calculateAge(123456789)).toThrow('birthDate must be a Date');
  });
  test('throws when birthDate is an Invalid Date', () => {
    expect(() => calculateAge(new Date('not a date'))).toThrow('birthDate is invalid');
  });
  test('returns N-1 when the birthday has not occurred yet this year', () => {
    const birth = new Date('2001-12-25T00:00:00Z');
    expect(calculateAge(birth)).toBe(24);
  });

});


describe('isAdult', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-05T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true when the user is exactly 18', () => {
    const birth = new Date('2008-05-05T00:00:00Z');
    expect(isAdult(birth)).toBe(true);
  });
  test('returns false when the user is one day under 18', () => {
    const birth = new Date('2008-05-06T00:00:00Z');
    expect(isAdult(birth)).toBe(false);
  });

});

describe('isValidName', () => {
  test('returns true for valid names', () => {
    expect(isValidName('Bremaud')).toBe(true);
    expect(isValidName('Béatrice')).toBe(true);
    expect(isValidName('Jean-Pierre')).toBe(true);
    expect(isValidName("O'Brien")).toBe(true);
    expect(isValidName('Saint-Jean-de-Luz')).toBe(true);
    expect(isValidName('François')).toBe(true);
  });
  test('returns false for invalid names', () => {
    expect(isValidName('')).toBe(false);
    expect(isValidName('John123')).toBe(false);
    expect(isValidName('John@Doe')).toBe(false);
    expect(isValidName('!!!')).toBe(false);
    expect(isValidName(undefined)).toBe(false);
    expect(isValidName(null)).toBe(false);
    expect(isValidName(42)).toBe(false);
  });

});

describe('isValidPostalCode', () => {
  test('returns true for valid French postal codes', () => {
    expect(isValidPostalCode('75001')).toBe(true);
    expect(isValidPostalCode('01000')).toBe(true);  // CP avec 0 en tête
    expect(isValidPostalCode('99999')).toBe(true);
  });
  test('returns false for invalid postal codes', () => {
    expect(isValidPostalCode('1234')).toBe(false);     // 4 chiffres
    expect(isValidPostalCode('123456')).toBe(false);   // 6 chiffres
    expect(isValidPostalCode('7500A')).toBe(false);    // contient une lettre
    expect(isValidPostalCode('')).toBe(false);         // vide
    expect(isValidPostalCode(75001)).toBe(false);      // nombre, pas string
    expect(isValidPostalCode(undefined)).toBe(false);
    expect(isValidPostalCode(null)).toBe(false);
  });

});

describe('isValidEmail', () => {
  test('returns true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('benoit.bremaud@vev.com')).toBe(true);
    expect(isValidEmail('user+tag@domain.fr')).toBe(true);
  });
  test('returns false for invalid emails', () => {
    expect(isValidEmail('plop')).toBe(false);              // pas de @
    expect(isValidEmail('plop@')).toBe(false);             // pas de domaine
    expect(isValidEmail('@domain.com')).toBe(false);       // pas de user
    expect(isValidEmail('user@domain')).toBe(false);       // pas de point
    expect(isValidEmail('user @domain.com')).toBe(false);  // espace
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
  });

});
