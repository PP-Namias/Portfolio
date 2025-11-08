import { Button } from "@heroui/react";
import { Calendar } from "lucide-react";
import type { ButtonProps } from "@heroui/react";

type CalendlyButtonProps = {
  variant?: "default" | "primary" | "ghost";
  size?: ButtonProps["size"];
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
};

export const CalendlyButton = ({
  variant = "default",
  size = "md",
  className = "",
  showIcon = true,
  children = "Schedule a Call",
}: CalendlyButtonProps) => {
  const calendlyUrl = "https://calendly.com/pp-namias/15-minute-meeting";

  const variantClasses = {
    default: "bg-custom-secondary text-foreground hover:bg-custom-secondary/80",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "bg-transparent hover:bg-custom-secondary",
  };

  return (
    <Button
      as="a"
      href={calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      size={size}
      startContent={showIcon ? <Calendar className="h-4 w-4" /> : undefined}
      className={`${variantClasses[variant]} rounded-lg font-bold ${className}`}
    >
      {children}
    </Button>
  );
};
