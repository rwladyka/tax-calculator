import { SUPPORTED_TAX_YEARS } from "@/config/constraints";
import { useFormContext } from "react-hook-form";

type YearSelectProps = {
  isLoading: boolean;
};

export const YearSelect = ({ isLoading }: YearSelectProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <label
        htmlFor="taxYear"
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        Tax Year
      </label>
      <select
        {...register("taxYear")}
        id="taxYear"
        name="taxYear"
        disabled={isLoading}
        aria-invalid={!!errors.taxYear}
        aria-describedby={errors.taxYear ? "year-error" : undefined}
        className={`w-full rounded-md border py-2 pl-3 pr-8 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          errors.taxYear
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
      >
        <option value="">Select a year</option>
        {SUPPORTED_TAX_YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {errors.taxYear?.message && (
        <p id="year-error" role="alert" className="mt-1 text-sm text-red-600">
          {errors.taxYear.message as string}
        </p>
      )}
    </>
  );
};
