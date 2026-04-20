import type { TaxBracket } from "@/features/tax-calculator/types/tax-calculator.types";

export const MOCK_2022_BRACKETS: TaxBracket[] = [
  { min: 0, max: 50197, rate: 0.15 },
  { min: 50197, max: 100392, rate: 0.205 },
  { min: 100392, max: 155625, rate: 0.26 },
  { min: 155625, max: 221708, rate: 0.29 },
  { min: 221708, rate: 0.33 },
];

export const MOCK_API_RESPONSE = {
  tax_brackets: MOCK_2022_BRACKETS,
};
