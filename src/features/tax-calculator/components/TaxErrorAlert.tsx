import { CircleX, X } from "lucide-react";

type TaxErrorAlertProps = {
  message: string;
  onDismiss?: () => void;
};

export const TaxErrorAlert = ({ message, onDismiss }: TaxErrorAlertProps) => (
  <div
    role="alert"
    className="rounded-md border border-red-200 bg-red-50 p-4"
    data-testid="tax-error"
  >
    <div className="flex items-start gap-3">
      <CircleX className="h-[18px] text-red-800" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">Calculation Error</p>
        <p className="mt-1 text-sm text-red-700">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="cursor-pointer rounded-md p-1 text-red-400 transition-colors hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <X className="h-[18px]" />
        </button>
      )}
    </div>
  </div>
);
