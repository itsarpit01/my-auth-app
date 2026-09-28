import { useState } from "react";

export function usePasswordToggle() {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => setIsVisible((prev) => !prev);
  const inputType = isVisible ? "text" : "password";

  return { isVisible, inputType, toggle };
}