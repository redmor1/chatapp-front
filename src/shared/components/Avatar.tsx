import { PersonIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-16 h-16 text-2xl",
  xl: "w-24 h-24 text-3xl",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Obtener la primera letra del nombre
  const initial = alt?.charAt(0)?.toUpperCase() || "?";

  const shouldShowImage = src && !imageError;

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold overflow-hidden ${className}`}
    >
      {shouldShowImage ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              {initial}
            </div>
          )}
        </>
      ) : (
        <>
          {initial !== "?" ? (
            initial
          ) : (
            <PersonIcon className={iconSizes[size]} />
          )}
        </>
      )}
    </div>
  );
}
