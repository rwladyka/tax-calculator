import {
  TaxCalculationResult,
  TaxBandResult,
} from "../types/tax-calculator.types";
import { formatCurrency, formatPercentage } from "../utils/tax-calculator";

type TaxResultsProps = {
  result: TaxCalculationResult;
};

export function TaxResults({ result }: TaxResultsProps) {
  return (
    <div className="space-y-6" data-testid="tax-results">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Annual Income"
          value={formatCurrency(result.annualIncome)}
          testId="annual-income"
        />
        <SummaryCard
          label="Total Tax"
          value={formatCurrency(result.totalTax)}
          testId="total-tax"
          highlighted
        />
        <SummaryCard
          label="Effective Rate"
          value={formatPercentage(result.effectiveRate)}
          testId="effective-rate"
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Tax Breakdown by Band
        </h3>
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium text-gray-600">
                  Bracket
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-medium text-gray-600"
                >
                  Rate
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-medium text-gray-600"
                >
                  Taxable Amount
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-medium text-gray-600"
                >
                  Tax Owed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.bands.map((band: TaxBandResult) => (
                <tr
                  key={`${band.min}-${band.max}`}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {formatCurrency(band.min)} –{" "}
                    {band.max === Infinity ? "∞" : formatCurrency(band.max)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatPercentage(band.rate)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatCurrency(band.taxableAmount)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(band.taxOwed)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-gray-700">
                  Total
                </td>
                <td
                  className="px-4 py-3 text-right text-gray-900"
                  data-testid="total-tax-footer"
                >
                  {formatCurrency(result.totalTax)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  testId: string;
  highlighted?: boolean;
};

function SummaryCard({
  label,
  value,
  testId,
  highlighted = false,
}: SummaryCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlighted ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-bold ${highlighted ? "text-blue-700" : "text-gray-900"}`}
        data-testid={testId}
      >
        {value}
      </p>
    </div>
  );
}
