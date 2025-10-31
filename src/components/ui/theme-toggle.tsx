import { forwardRef, Ripple, useButton, type ButtonProps } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "../../context/theme-context";

export const ThemeToggle = forwardRef((props, ref) => {
  const { theme, toggleTheme } = useThemeContext();

  const propsOverrides: Partial<ButtonProps> = {
    isIconOnly: true,
    size: "sm",
    onPress: toggleTheme,
    className: "bg-custom-secondary text-primary rounded-lg",
  };

  const heroButton = useButton({ ref, ...{ ...props, ...propsOverrides } });

  return (
    <button ref={heroButton.domRef} {...heroButton.getButtonProps()}>
      <div className="">{theme === "light" ? <Sun /> : <Moon />}</div>
      {<Ripple {...heroButton.getRippleProps()} />}
    </button>
  );
});
