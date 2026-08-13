"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { pressable } from "@/lib/motion";
import { Spinner } from "@/components/ui/Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <motion.button
      ref={ref}
      disabled={disabled || isLoading}
      whileHover={disabled || isLoading ? undefined : pressable.whileHover}
      whileTap={disabled || isLoading ? undefined : pressable.whileTap}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
        variant === "secondary" &&
          "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="border-current/20 border-t-current" />}
      {isLoading ? "Loading..." : children}
    </motion.button>
  )
);

Button.displayName = "Button";
