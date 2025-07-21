import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";

const autoCompleteMap = {
  email: "email",
  username: "username",
};

const InputField = ({ name, label, type = "text", placeholder }) => {
  const {
    register,
    formState: { isSubmitted },
    getFieldState,
  } = useFormContext();

  const { error, isTouched } = getFieldState(name);

  const showFeedback = isTouched || isSubmitted;
  const hasError = Boolean(error) && showFeedback;
  const isValid = !error && showFeedback;

  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoCompleteMap[name] || "off"}
        aria-invalid={hasError}
        aria-describedby={`${name}-feedback`}
        {...register(name)}
        className={`rounded-sm border
          ${
            hasError
              ? "border-red-500 focus:ring-red-300"
              : isValid
              ? "border-emerald-500 focus:ring-emerald-300"
              : "border-gray-300 focus:ring-blue-300"
          }`}
      />

      <div
        id={`${name}-feedback`}
        aria-live="polite"
        className="min-h-[1.25rem]"
      >
        {hasError ? (
          <p className="text-xs text-red-500 mt-1">{error.message}</p>
        ) : isValid ? (
          <p className="text-xs text-emerald-600 mt-1">Looks good!</p>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(InputField);
