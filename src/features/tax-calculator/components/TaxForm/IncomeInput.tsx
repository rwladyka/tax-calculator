import { useFormContext } from 'react-hook-form';

type IncomeInputProps = {
  isLoading: boolean;
};

export const IncomeInput = ({ isLoading }: IncomeInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  return (
    <>
      <label htmlFor="annualIncome" className="mb-1 block text-sm font-medium text-gray-700">
        Annual Income
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          $
        </span>
        <input
          {...register('annualIncome', { valueAsNumber: true })}
          id="annualIncome"
          name="annualIncome"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          disabled={isLoading}
          aria-invalid={!!errors.annualIncome}
          aria-describedby={errors.annualIncome ? 'income-error' : undefined}
          className={`w-full rounded-md border py-2 pl-7 pr-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.annualIncome
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
      </div>
      {errors.annualIncome?.message && (
        <p id="income-error" role="alert" className="mt-1 text-sm text-red-600">
          {errors.annualIncome.message as string}
        </p>
      )}
    </>
  );
};
