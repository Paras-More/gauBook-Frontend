import React, { useEffect } from "react";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  darkSrc?: string;
  lightSrc?: string;
  ariaHidden?: boolean;
}

/**
 * Logo component that automatically switches between dark and light theme logos.
 *
 * Usage:
 * <Logo />
 * <Logo className="h-10" />
 * <Logo darkSrc="/assets/gauBookLogoDark.png" lightSrc="/assets/gauBookLogo.png" />
 */
const Logo: React.FC<LogoProps> = ({
  className = "h-full max-h-12 w-auto object-contain",
  style,
  alt = "GauBook Logo",
  darkSrc = "/assests/gauBookLogoDark.png",
  lightSrc = "/assests/gauBookLogo.png",
  ariaHidden = true,
}) => {
  // Use prefers-color-scheme to detect theme
  const [isDark, setIsDark] = React.useState(false);

  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    console.log(match);

    setIsDark(match.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    match.addEventListener("change", handler);
    return () => match.removeEventListener("change", handler);
  }, []);

  return (
    <img
      src={isDark ? darkSrc : lightSrc}
      alt={alt}
      className={className}
      style={style}
      aria-hidden={ariaHidden}
    />
  );
};

export default Logo;
