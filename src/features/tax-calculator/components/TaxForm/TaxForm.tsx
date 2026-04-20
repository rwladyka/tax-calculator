import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';

import type { TaxFormData } from '../../types/tax-calculator.types';
import { taxFormSchema } from '../../types/tax-calculator-schemas';
import { IncomeInput } from './IncomeInput';
import { YearSelect } from './YearSelect';

type TaxFormProps = {
  onSubmit: (data: TaxFormData) => void;
  isLoading: boolean;
};

export const TaxForm = ({ onSubmit, isLoading }: TaxFormProps) => {
  const methods = useForm({
    resolver: zodResolver(taxFormSchema),
  });

  function handleSubmit(data: TaxFormData) {
    onSubmit(data);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate className="space-y-5">
        <IncomeInput isLoading={isLoading} />

        <YearSelect isLoading={isLoading} />

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Calculating…
            </>
          ) : (
            'Calculate Tax'
          )}
        </button>
      </form>
    </FormProvider>
  );
};
