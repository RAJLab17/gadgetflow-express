import { forwardRef, useRef, MouseEvent, ReactNode, ButtonHTMLAttributes } from "react";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Strength of the magnetic pull (px). Default 12. */
  strength?: number;
  className?: string;
}

/**
 * Desktop-only magnetic effect: button gently follows the cursor on hover.
 * Disabled on touch devices via CSS @media (hover: hover).
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, strength = 12, className = "", ...rest }, _ref) => {
    const innerRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
      const btn = innerRef.current;
      if (!btn) return;
      // Skip on touch devices / coarse pointers
      if (window.matchMedia("(hover: none)").matches) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
    };

    const handleMouseLeave = () => {
      const btn = innerRef.current;
      if (!btn) return;
      btn.style.transform = "translate(0px, 0px)";
    };

    return (
      <button
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
