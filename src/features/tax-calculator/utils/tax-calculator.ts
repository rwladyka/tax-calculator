import type {
  TaxBandResult,
  TaxBracket,
  TaxCalculationResult,
} from '../types/tax-calculator.types';

/**
 * Calculates the tax owed for a single bracket.
 *
 * Uses the marginal tax system: only the portion of income
 * within the bracket's [min, max) range is taxed at that rate.
 *
 * @param income - Gross annual income
 * @param bracket - Tax bracket definition from the API
 * @returns Tax band result with taxable amount and tax owed
 */
export function calculateBandTax(income: number, bracket: TaxBracket): TaxBandResult {
  const max = bracket.max ?? Infinity;

  if (income <= bracket.min) {
    return {
      min: bracket.min,
      max,
      rate: bracket.rate,
      taxableAmount: 0,
      taxOwed: 0,
    };
  }

  const taxableAmount = Math.min(income, max) - bracket.min;
  const taxOwed = roundCurrency(taxableAmount * bracket.rate);

  return {
    min: bracket.min,
    max,
    rate: bracket.rate,
    taxableAmount,
    taxOwed,
  };
}

/**
 * Calculates total income tax using the provided marginal tax brackets.
 *
 * This is a pure function with no side effects — all inputs are explicit
 * and the output is deterministic. This design makes it trivially testable
 * and allows the same logic to run on the server if needed.
 *
 * @param annualIncome - Gross annual income (must be >= 0)
 * @param taxBrackets - Ordered list of marginal tax brackets from the API
 * @param taxYear - Year used for the calculation (metadata only)
 * @returns Complete calculation result including per-band breakdown
 *
 * @example
 * ```ts
 * const result = calculateTax(100000, brackets, 2022);
 * console.log(result.totalTax);      // 17739.17
 * console.log(result.effectiveRate);  // 0.1774
 * ```
 */
export function calculateTax(
  annualIncome: number,
  taxBrackets: TaxBracket[],
  taxYear: number,
): TaxCalculationResult {
  if (annualIncome < 0) {
    throw new Error('Annual income must be zero or greater');
  }

  if (taxBrackets.length === 0) {
    throw new Error('At least one tax bracket is required');
  }

  const bands = taxBrackets.map((bracket) => calculateBandTax(annualIncome, bracket));
  const totalTax = roundCurrency(bands.reduce((sum, band) => sum + band.taxOwed, 0));
  const effectiveRate = annualIncome > 0 ? totalTax / annualIncome : 0;

  return {
    annualIncome,
    taxYear,
    totalTax,
    effectiveRate,
    bands,
  };
}

/**
 * Rounds a number to two decimal places (currency precision).
 * Uses Math.round to avoid floating-point drift.
 */
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Formats a number as a currency string (CAD).
 *
 * @example formatCurrency(17739.17) → "$17,739.17"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a decimal rate as a percentage string.
 *
 * @example formatPercentage(0.1774) → "17.74%"
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}
