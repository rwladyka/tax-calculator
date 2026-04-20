import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaxForm } from "./TaxForm";

describe("TaxForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
  };

  function renderForm(props = {}) {
    return render(<TaxForm {...defaultProps} {...props} />);
  }

  it("renders income input and year select", () => {
    renderForm();

    expect(screen.getByLabelText(/annual income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tax year/i)).toBeInTheDocument();
  });

  it("calls onSubmit with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/annual income/i), "100000");
    await user.selectOptions(screen.getByLabelText(/tax year/i), "2022");
    await user.click(screen.getByRole("button", { name: /calculate/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      annualIncome: 100000,
      taxYear: 2022,
    });
  });

  it("shows validation error for empty income", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText(/tax year/i), "2022");
    await user.click(screen.getByRole("button", { name: /calculate/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error when no year is selected", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/annual income/i), "50000");
    await user.click(screen.getByRole("button", { name: /calculate/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("disables controls and shows spinner while loading", () => {
    renderForm({ isLoading: true });

    expect(screen.getByLabelText(/annual income/i)).toBeDisabled();
    expect(screen.getByLabelText(/tax year/i)).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText(/calculating/i)).toBeInTheDocument();
  });

  it("renders all supported tax year options", () => {
    renderForm();

    const select = screen.getByLabelText(/tax year/i);
    expect(select).toContainHTML("2019");
    expect(select).toContainHTML("2020");
    expect(select).toContainHTML("2021");
    expect(select).toContainHTML("2022");
  });

  it("shows validation error for negative income", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/annual income/i), "-5000");
    await user.selectOptions(screen.getByLabelText(/tax year/i), "2022");
    await user.click(screen.getByRole("button", { name: /calculate/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
});
