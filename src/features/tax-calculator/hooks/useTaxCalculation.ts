import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { taxApiService } from '../services/tax-api';
import type { SupportedTaxYear, TaxBracketsResponse } from '../types/tax-calculator.types';

export function useTaxCalculation(
  year?: SupportedTaxYear,
): UseQueryResult<TaxBracketsResponse | null, Error> {
  return useQuery({
    queryKey: ['tax-brackets', year],
    queryFn: async () => {
      if (!year) return null;
      return await taxApiService.fetchTaxBrackets(year);
    },
    enabled: !!year,
  });
}
