import { useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/http-client";
import { TaxForm } from "./components/TaxForm/TaxForm";
import { TaxResults } from "./components/TaxResults";
import { TaxErrorAlert } from "./components/TaxErrorAlert";
import { useTaxCalculation } from "./hooks/useTaxCalculation";
import { TaxFormData } from "./types/tax-calculator.types";
import { calculateTax } from "./utils/tax-calculator";

export function TaxCalculatorPage() {
  const [input, setInput] = useState<TaxFormData | null>(null);
  const { isLoading, error, data } = useTaxCalculation(input?.taxYear);

  const taxResults = useMemo(() => {
    if (!input?.annualIncome || !input?.taxYear || !data?.tax_brackets?.length)
      return null;

    return calculateTax(
      input?.annualIncome,
      data?.tax_brackets,
      input?.taxYear,
    );
  }, [input, data]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Income Tax Calculator
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Calculate income tax based on tax brackets.
        </p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <TaxForm onSubmit={(input) => setInput(input)} isLoading={isLoading} />
      </div>

      <div className="mt-6 space-y-6">
        {error && <TaxErrorAlert message={getErrorMessage(error)} />}

        {taxResults && <TaxResults result={taxResults} />}
      </div>
    </div>
  );
}
