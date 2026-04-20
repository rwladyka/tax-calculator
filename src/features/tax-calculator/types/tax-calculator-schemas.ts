import z from "zod";
import { SupportedTaxYear } from "./tax-calculator.types";
import { SUPPORTED_TAX_YEARS } from "@/config/constraints";

export const taxBracketSchema = z.object({
  min: z.number().min(0),
  max: z.number().positive().optional(),
  rate: z.number().min(0).max(1),
});

export const taxBracketsResponseSchema = z.object({
  tax_brackets: z.array(taxBracketSchema).min(1),
});

export const taxFormSchema = z.object({
  annualIncome: z
    .number({ message: "Please enter a valid number" })
    .min(0, "Income must be zero or greater")
    .max(1_000_000_000, "Income exceeds maximum allowed value"),
  taxYear: z.coerce
    .number()
    .refine(
      (val): val is SupportedTaxYear =>
        SUPPORTED_TAX_YEARS.includes(val as SupportedTaxYear),
      { message: `Tax year must be one of: ${SUPPORTED_TAX_YEARS.join(", ")}` },
    ),
});
