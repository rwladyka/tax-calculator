import { describe, expect, it } from 'vitest';
import { MOCK_2022_BRACKETS } from '@/test/fixtures';
import {
  calculateBandTax,
  calculateTax,
  formatCurrency,
  formatPercentage,
  roundCurrency,
} from './tax-calculator';

describe('calculateBandTax', () => {
  const bracket = { min: 50197, max: 100392, rate: 0.205 };

  it('returns zero when income is below the bracket minimum', () => {
    const result = calculateBandTax(30000, bracket);
    expect(result.taxableAmount).toBe(0);
    expect(result.taxOwed).toBe(0);
  });

  it('calculates tax for income within the bracket', () => {
    const result = calculateBandTax(75000, bracket);
    expect(result.taxableAmount).toBe(75000 - 50197);
    expect(result.taxOwed).toBe(roundCurrency(24803 * 0.205));
  });

  it('caps taxable amount at the bracket maximum', () => {
    const result = calculateBandTax(200000, bracket);
    expect(result.taxableAmount).toBe(100392 - 50197);
  });

  it('handles the top bracket with no max', () => {
    const topBracket = { min: 221708, rate: 0.33 };
    const result = calculateBandTax(500000, topBracket);
    expect(result.taxableAmount).toBe(500000 - 221708);
    expect(result.max).toBe(Infinity);
  });
});

describe('calculateTax', () => {
  /**
   * These test cases match the assessment spec exactly.
   * The expected values come from the requirements document.
   */
  it.each([
    { income: 0, expectedTax: 0, description: '$0 income' },
    { income: 50000, expectedTax: 7500.0, description: '$50,000 income' },
    { income: 100000, expectedTax: 17739.17, description: '$100,000 income' },
    {
      income: 1234567,
      expectedTax: 385587.64,
      description: '$1,234,567 income',
    },
  ])('calculates correctly for $description → $expectedTax', ({ income, expectedTax }) => {
    const result = calculateTax(income, MOCK_2022_BRACKETS, 2022);
    expect(result.totalTax).toBe(expectedTax);
  });

  it('returns all required fields in the result', () => {
    const result = calculateTax(100000, MOCK_2022_BRACKETS, 2022);

    expect(result).toEqual(
      expect.objectContaining({
        annualIncome: 100000,
        taxYear: 2022,
        totalTax: expect.any(Number),
        effectiveRate: expect.any(Number),
        bands: expect.any(Array),
      }),
    );
  });

  it('calculates the correct effective rate', () => {
    const result = calculateTax(100000, MOCK_2022_BRACKETS, 2022);
    expect(result.effectiveRate).toBeCloseTo(17739.17 / 100000, 4);
  });

  it('returns effective rate of 0 for $0 income', () => {
    const result = calculateTax(0, MOCK_2022_BRACKETS, 2022);
    expect(result.effectiveRate).toBe(0);
  });

  it('returns one band result per tax bracket', () => {
    const result = calculateTax(100000, MOCK_2022_BRACKETS, 2022);
    expect(result.bands).toHaveLength(MOCK_2022_BRACKETS.length);
  });

  it('throws for negative income', () => {
    expect(() => calculateTax(-1, MOCK_2022_BRACKETS, 2022)).toThrow(
      'Annual income must be zero or greater',
    );
  });

  it('throws for empty brackets', () => {
    expect(() => calculateTax(50000, [], 2022)).toThrow('At least one tax bracket is required');
  });
});

describe('roundCurrency', () => {
  it('rounds to two decimal places', () => {
    expect(roundCurrency(17739.165)).toBe(17739.17);
    expect(roundCurrency(17739.174)).toBe(17739.17);
    expect(roundCurrency(100.005)).toBe(100.01);
  });
});

describe('formatCurrency', () => {
  it('formats numbers as Canadian dollars', () => {
    const formatted = formatCurrency(17739.17);
    expect(formatted).toContain('17,739.17');
    expect(formatted).toContain('$');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toContain('0.00');
  });
});

describe('formatPercentage', () => {
  it('formats decimal rate as percentage', () => {
    expect(formatPercentage(0.1774)).toBe('17.74%');
  });

  it('handles zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });
});
