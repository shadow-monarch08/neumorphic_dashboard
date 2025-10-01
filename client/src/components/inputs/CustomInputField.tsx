import React, { useState, useRef } from "react";
import LordIconPlayer from "../../utils/LordIconPlayer";
import { icons } from "../../constants";

interface CustomInputFieldProps {
  type?: "text" | "email" | "password" | "number" | "textarea";
  label?: string;
  placeholder?: string;
  icon?: any; // lottie JSON (imported) or undefined
  value?: string;
  name?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  status?: "none" | "error" | "success";
  errorMessage?: string;
  successMessage?: string;
  inputClassName?: string;
  containerClassName?: string;
  iconPosition?: "left" | "right";
  onFocus?: () => void;
  onBlur?: () => void;
  rows?: number; // For textarea
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  type = "text",
  label,
  placeholder,
  icon,
  value,
  name,
  onChange,
  disabled = false,
  status = "none",
  errorMessage,
  successMessage,
  inputClassName,
  containerClassName,
  iconPosition = "left",
  onFocus,
  onBlur,
  rows = 4,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const iconRef = useRef<any>(null);

  const isError = status === "error";

  const borderClass =
    status !== "none"
      ? isError
        ? "border-[1px] border-error"
        : "border-[1px] border-success"
      : "border-[0.5px] border-tertiary";

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (iconRef.current) {
      iconRef.current.playFromBeginning?.();
    }
    onFocus?.();
  };

  const showIcon = type !== "textarea" && icon;

  return (
    <div
      className={`w-full relative ${
        disabled ? "opacity-70" : ""
      } ${containerClassName}`}
    >
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 font-plight text-tertiary-100"
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center rounded-lg overflow-hidden relative ${borderClass}`}
      >
        {showIcon && iconPosition === "left" && (
          <div className="px-2 flex items-center">
            <LordIconPlayer
              ref={iconRef}
              size={20}
              icon={icon}
              color="#645b52"
            />
          </div>
        )}

        {type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={onBlur}
            rows={rows}
            className={`py-2 px-3 w-full text-tertiary-100 font-plight text-sm neumorphic-in-xs input-noFocus small-scrollbar resize-none ${inputClassName}`}
          />
        ) : (
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={onBlur}
            className={`py-2 px-3 w-full text-tertiary-100 font-plight text-sm neumorphic-in-xs input-noFocus ${inputClassName}`}
          />
        )}

        {type === "password" && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <img src={icons.eye_open} className="size-4" />
            ) : (
              <img src={icons.eye_closed} className="size-4" />
            )}
          </span>
        )}

        {showIcon && iconPosition === "right" && (
          <div className="px-4">
            <LordIconPlayer
              ref={iconRef}
              size={20}
              icon={icon}
              color="#645b52"
            />
          </div>
        )}
      </div>
      <div className="w-full h-3 pt-1">
        {status !== "none" && (
          <p className={`text-sm ${isError ? "text-error" : "text-success"}`}>
            {isError ? errorMessage : successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomInputField;
