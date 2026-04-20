import { taxApiService } from "../services/tax-api";
import {
  SupportedTaxYear,
  TaxBracketsResponse,
} from "../types/tax-calculator.types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useTaxCalculation(
  year?: SupportedTaxYear,
): UseQueryResult<TaxBracketsResponse | null, Error> {
  return useQuery({
    queryKey: ["tax-brackets", year],
    queryFn: async () => {
      if (!year) return null;
      return await taxApiService.fetchTaxBrackets(year);
    },
    enabled: !!year,
  });
}
