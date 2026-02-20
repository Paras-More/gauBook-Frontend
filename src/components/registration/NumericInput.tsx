import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumericInputProps {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  allowNegative?: boolean;
  step?: "1" | "0.01" | "0.1";
  maxLength?: number;
  required?: boolean;
  inputMode?: "numeric" | "decimal";
}

/**
 * Reusable numeric input component for form fields
 * Automatically validates and filters non-numeric input
 * Can be configured for integers, decimals, and negative values
 * Handles all edge cases including:
 * - Leading zeros
 * - Multiple decimal points
 * - Negative values validation
 * - Empty values
 */
export const NumericInput = ({
  label,
  placeholder = "0",
  value,
  onChange,
  error,
  allowNegative = false,
  step = "1",
  maxLength,
  required = false,
  inputMode = "numeric",
}: NumericInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Handle empty value
    if (inputValue === "") {
      onChange("");
      return;
    }

    // Handle negative sign
    const isNegative = inputValue.startsWith("-");
    if (isNegative && !allowNegative) {
      inputValue = inputValue.substring(1);
    }

    // Determine if we're working with decimals
    const isDecimal = step === "0.01" || step === "0.1";

    if (isDecimal) {
      // Allow only numbers and a single decimal point
      inputValue = inputValue.replace(/[^\d.]/g, "");

      // Remove duplicate decimal points (keep only the first one)
      const decimalIndex = inputValue.indexOf(".");
      if (decimalIndex !== -1) {
        const beforeDecimal = inputValue.substring(0, decimalIndex);
        const afterDecimal = inputValue.substring(decimalIndex + 1);
        inputValue = beforeDecimal + "." + afterDecimal.replace(/\./g, "");
      }

      // Limit decimal places based on step
      if (step === "0.01" && inputValue.includes(".")) {
        const parts = inputValue.split(".");
        if (parts[1] && parts[1].length > 2) {
          inputValue = parts[0] + "." + parts[1].substring(0, 2);
        }
      } else if (step === "0.1" && inputValue.includes(".")) {
        const parts = inputValue.split(".");
        if (parts[1] && parts[1].length > 1) {
          inputValue = parts[0] + "." + parts[1].substring(0, 1);
        }
      }
    } else {
      // Filter to numbers only for integer fields
      inputValue = inputValue.replace(/\D/g, "");
    }

    // Apply max length constraint if provided
    if (maxLength && inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }

    // Ensure value is not negative if not allowed
    if (!allowNegative) {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue) && numValue < 0) {
        inputValue = Math.abs(numValue).toString();
      }
    }

    // Prepend negative sign if needed
    if (isNegative && allowNegative && inputValue) {
      inputValue = "-" + inputValue;
    }

    onChange(inputValue);
  };

  return (
    <div>
      <Label>
        {label}
        {required && " *"}
      </Label>
      <Input
        type="number"
        placeholder={placeholder}
        inputMode={inputMode}
        min={allowNegative ? undefined : "0"}
        step={step}
        maxLength={maxLength}
        value={value || ""}
        onChange={handleChange}
        className={error ? "border-red-500" : ""}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default NumericInput;
