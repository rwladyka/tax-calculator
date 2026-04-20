import { z } from "zod";

import {
  taxBracketSchema,
  taxBracketsResponseSchema,
  taxFormSchema,
} from "./tax-calculator-schemas";
import { SUPPORTED_TAX_YEARS } from "@/config/constraints";

export type TaxBracket = z.infer<typeof taxBracketSchema>;
export type TaxBracketsResponse = z.infer<typeof taxBracketsResponseSchema>;

export type TaxBandResult = {
  min: number;
  max: number;
  rate: number;
  taxableAmount: number;
  taxOwed: number;
};

export type TaxCalculationResult = {
  annualIncome: number;
  taxYear: number;
  totalTax: number;
  effectiveRate: number;
  bands: TaxBandResult[];
};

export type SupportedTaxYear = (typeof SUPPORTED_TAX_YEARS)[number];

export type TaxFormData = z.infer<typeof taxFormSchema>;
