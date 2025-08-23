"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  let variantStyles = "";
  if (variant === "default")
    variantStyles =
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  if (variant === "outline")
    variantStyles =
      "border border-gray-300 dark:border-gray-600 bg-transparent text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400";
  if (variant === "ghost")
    variantStyles =
      "bg-transparent text-foreground hover:bg-gray-100 dark:hover:bg-gray-800";
  if (variant === "destructive")
    variantStyles =
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";

  let sizeStyles = "";
  if (size === "sm") sizeStyles = "h-8 px-3 text-xs";
  if (size === "md") sizeStyles = "h-9 px-4 text-sm";
  if (size === "lg") sizeStyles = "h-11 px-6 text-base";
  if (size === "icon") sizeStyles = "h-9 w-9 p-2";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
