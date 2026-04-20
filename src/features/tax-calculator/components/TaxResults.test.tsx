import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TaxCalculationResult } from '../types/tax-calculator.types';
import { TaxResults } from './TaxResults';

const mockResult: TaxCalculationResult = {
  annualIncome: 100000,
  taxYear: 2022,
  totalTax: 17739.17,
  effectiveRate: 0.1773917,
  bands: [
    { min: 0, max: 50197, rate: 0.15, taxableAmount: 50000, taxOwed: 7500 },
    {
      min: 50197,
      max: 100392,
      rate: 0.205,
      taxableAmount: 49803,
      taxOwed: 10209.62,
    },
    { min: 100392, max: 155625, rate: 0.26, taxableAmount: 0, taxOwed: 0 },
    { min: 155625, max: 221708, rate: 0.29, taxableAmount: 0, taxOwed: 0 },
    { min: 221708, max: Infinity, rate: 0.33, taxableAmount: 0, taxOwed: 0 },
  ],
};

describe('TaxResults', () => {
  it('renders the results container', () => {
    render(<TaxResults result={mockResult} />);
    expect(screen.getByTestId('tax-results')).toBeInTheDocument();
  });

  it('displays total tax amount', () => {
    render(<TaxResults result={mockResult} />);
    const totalTax = screen.getByTestId('total-tax');
    expect(totalTax).toHaveTextContent('17,739.17');
  });

  it('displays effective rate', () => {
    render(<TaxResults result={mockResult} />);
    const rate = screen.getByTestId('effective-rate');
    expect(rate).toHaveTextContent('17.74%');
  });

  it('displays annual income', () => {
    render(<TaxResults result={mockResult} />);
    const income = screen.getByTestId('annual-income');
    expect(income).toHaveTextContent('100,000.00');
  });

  it('renders a row for each tax band', () => {
    render(<TaxResults result={mockResult} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(7);
  });

  it('shows total in the table footer', () => {
    render(<TaxResults result={mockResult} />);
    const footer = screen.getByTestId('total-tax-footer');
    expect(footer).toHaveTextContent('17,739.17');
  });
});
