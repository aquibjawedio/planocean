import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({ name, label, placeholder }) => {
  const [hidePassword, setHidePassword] = useState(true);
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

      <div className="relative">
        <Input
          id={name}
          type={hidePassword ? "password" : "text"}
          placeholder={placeholder}
          autoComplete="current-password"
          aria-invalid={hasError}
          aria-describedby={`${name}-feedback`}
          {...register(name)}
          className={`rounded-sm border pr-10
            ${
              hasError
                ? "border-red-500 focus:ring-red-300"
                : isValid
                ? "border-emerald-500 focus:ring-emerald-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
        />

        <Button
          type="button"
          variant="ghost"
          onClick={() => setHidePassword(!hidePassword)}
          className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {hidePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </Button>
      </div>

      <div id={`${name}-feedback`} aria-live="polite" className="min-h-[1.25rem]">
        {hasError ? (
          <p className="text-xs text-red-500 mt-1">{error.message}</p>
        ) : isValid ? (
          <p className="text-xs text-emerald-600 mt-1">Looks good!</p>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(PasswordField);
