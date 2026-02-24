// src/lib/toast.ts
import { toast } from "sonner";

// Success Toast //

const successToastStyle = {
  background: "#e0fbe6",
  color: "#166534",
  border: "1px solid #bbf7d0",
  borderRadius: "14px",
  fontWeight: "500",
};

export function showSuccessToast(message: string, options = {}) {
  toast.success(message, {
    style: successToastStyle,
    position: "top-right",
    ...options,
    duration: 1500,
  });
}

// Error Toast //

const errorToastStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  border: "1px solid #fecaca",
  borderRadius: "14px",
  fontWeight: "500",
};
export function showErrorToast(message: string, options = {}) {
  toast.error(message, {
    style: errorToastStyle,
    position: "top-right",
    ...options,
    duration: 1500,
  });
}

//  Info Toast //

const infoToastStyle = {
  background: "#e0f2fe",
  color: "#0369a1",
  border: "1px solid #bae6fd",
  borderRadius: "14px",
  fontWeight: "500",
};

export function showInfoToast(message: string, options = {}) {
  toast(message, {
    style: infoToastStyle,
    position: "top-right",
    ...options,
    duration: 1500,
  });
}
