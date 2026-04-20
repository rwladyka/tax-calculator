import { SUPPORTED_TAX_YEARS } from '@/config/constraints';
import { http } from '@/lib/http-client';
import { createLogger } from '@/lib/logger';
import type { SupportedTaxYear, TaxBracketsResponse } from '../types/tax-calculator.types';
import { taxBracketsResponseSchema } from '../types/tax-calculator-schemas';

const logger = createLogger('TaxApiService');

export const taxApiService = {
  async fetchTaxBrackets(year: SupportedTaxYear): Promise<TaxBracketsResponse> {
    if (!SUPPORTED_TAX_YEARS.includes(year)) {
      throw new Error(
        `Unsupported tax year: ${year}. Supported years: ${SUPPORTED_TAX_YEARS.join(', ')}`,
      );
    }

    logger.info('Fetching tax brackets', { year });

    try {
      const response = await http
        .get(`tax-calculator/tax-year/${year}`)
        .json(taxBracketsResponseSchema);

      logger.info('Tax brackets fetched successfully', {
        year,
        bracketCount: response.tax_brackets.length,
      });

      return response;
    } catch (error) {
      logger.error('Failed to fetch tax brackets', {
        year,
        error,
      });

      throw error;
    }
  },
};
