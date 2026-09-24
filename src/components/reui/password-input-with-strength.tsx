"use client";

import { useId, useMemo, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputWithStrengthProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  showStrength?: boolean;
  rightAction?: React.ReactNode;
}

export function PasswordInputWithStrength({
  id: customId,
  name = "password",
  label = "Kata Sandi",
  value,
  onChange,
  placeholder = "Minimal 8 karakter",
  required = true,
  showStrength = true,
  rightAction,
}: PasswordInputWithStrengthProps) {
  const generatedId = useId();
  const id = customId ?? generatedId;
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  // Score from 0 to 4 (only calculated when showStrength is enabled)
  const score = useMemo(() => {
    if (!showStrength) return 0;
    let s = 0;
    if (value.length >= 8) s += 1;
    if (/[0-9]/.test(value)) s += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) s += 1;
    if (/[^A-Za-z0-9]/.test(value)) s += 1;
    return s;
  }, [value, showStrength]);

  const strengthLabel = useMemo(() => {
    if (!showStrength || !value) return null;
    if (score <= 1) return { text: "Lemah", color: "text-rose-500" };
    if (score === 2) return { text: "Cukup", color: "text-amber-500" };
    if (score === 3) return { text: "Kuat", color: "text-emerald-500" };
    return { text: "Sangat Kuat", color: "text-emerald-400" };
  }, [value, score, showStrength]);

  const getSegmentColor = (index: number) => {
    if (index >= score) return "bg-muted/40";
    if (score <= 1) return "bg-rose-500";
    if (score === 2) return "bg-amber-500";
    if (score === 3) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <Label htmlFor={id} className="text-xs font-medium text-foreground">
          {label}
        </Label>
        {showStrength && strengthLabel && (
          <span className={`text-[11px] font-medium ${strengthLabel.color}`}>
            {strengthLabel.text}
          </span>
        )}
        {!showStrength && rightAction && rightAction}
      </div>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="h-9 pe-9 text-xs rounded-lg border-border/60 bg-background/50 focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 transition-colors"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          tabIndex={-1}
          aria-label={isVisible ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/60 transition-colors hover:text-foreground focus:outline-none"
        >
          {isVisible ? (
            <EyeOffIcon className="size-3.5" />
          ) : (
            <EyeIcon className="size-3.5" />
          )}
        </button>
      </div>

      {/* Ultra-minimal 2px segmented progress indicator (signup only) */}
      {showStrength && value.length > 0 && (
        <div className="flex h-1 w-full gap-1 pt-0.5" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${getSegmentColor(
                index
              )}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
