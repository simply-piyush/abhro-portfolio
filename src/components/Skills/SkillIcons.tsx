import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

// 1. Adobe Photoshop (Ps)
export const PhotoshopIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Adobe Photoshop"
  >
    <rect width="48" height="48" rx="10" fill="#001E36" />
    <rect x="1" y="1" width="46" height="46" rx="9" stroke="#31A8FF" strokeWidth="2" />
    <path
      d="M14 15H21C24.3137 15 27 17.2386 27 20C27 22.7614 24.3137 25 21 25H18V33H14V15ZM18 18.5V21.5H20.8C22.015 21.5 23 20.8284 23 20C23 19.1716 22.015 18.5 20.8 18.5H18Z"
      fill="#31A8FF"
    />
    <path
      d="M28.5 28.2C29.2 27.4 30.3 26.9 31.6 26.9C33.2 26.9 34.2 27.7 34.2 28.9C34.2 30 33.3 30.6 31.8 31.1L30.3 31.6C28.2 32.3 27 33.5 27 35.3C27 37.8 29.1 39.5 32.1 39.5C33.8 39.5 35.2 38.9 36.1 37.9L34.6 35.6C33.9 36.3 33 36.7 32 36.7C30.7 36.7 29.9 36 29.9 35C29.9 34 30.8 33.4 32.2 32.9L33.7 32.4C35.9 31.7 37.1 30.4 37.1 28.7C37.1 26.3 35.1 24.7 32 24.7C30.4 24.7 29 25.2 28 26.1L28.5 28.2Z"
      fill="#31A8FF"
    />
  </svg>
);

// 2. Adobe InDesign (Id)
export const InDesignIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Adobe InDesign"
  >
    <rect width="48" height="48" rx="10" fill="#49021F" />
    <rect x="1" y="1" width="46" height="46" rx="9" stroke="#FF3366" strokeWidth="2" />
    <rect x="15" y="15" width="4" height="18" fill="#FF3366" />
    <path
      d="M24 15H28V20.2C28.9 19.4 30.1 18.8 31.5 18.8C34.6 18.8 37 21.2 37 25.8C37 30.4 34.5 33 31.3 33C29.9 33 28.8 32.4 28 31.5V33H24V15ZM30.5 22.2C29 22.2 28 23.4 28 25.8C28 28.2 29 29.5 30.5 29.5C32 29.5 33 28.2 33 25.8C33 23.4 32 22.2 30.5 22.2Z"
      fill="#FF3366"
    />
  </svg>
);

// 3. Adobe Illustrator (Ai)
export const IllustratorIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Adobe Illustrator"
  >
    <rect width="48" height="48" rx="10" fill="#330000" />
    <rect x="1" y="1" width="46" height="46" rx="9" stroke="#FF9A00" strokeWidth="2" />
    <path
      d="M19.5 15L13 33H17.2L18.6 29H24.4L25.8 33H30L23.5 15H19.5ZM19.8 25.5L21.5 20.3L23.2 25.5H19.8Z"
      fill="#FF9A00"
    />
    <circle cx="34" cy="18" r="2" fill="#FF9A00" />
    <rect x="32" y="22" width="4" height="11" fill="#FF9A00" />
  </svg>
);

// 4. Adobe Premiere Pro (Pr)
export const PremiereIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Adobe Premiere Pro"
  >
    <rect width="48" height="48" rx="10" fill="#00005B" />
    <rect x="1" y="1" width="46" height="46" rx="9" stroke="#9999FF" strokeWidth="2" />
    <path
      d="M14 15H21C24.3137 15 27 17.2386 27 20C27 22.7614 24.3137 25 21 25H18V33H14V15ZM18 18.5V21.5H20.8C22.015 21.5 23 20.8284 23 20C23 19.1716 22.015 18.5 20.8 18.5H18Z"
      fill="#9999FF"
    />
    <path
      d="M29 20H33V23.5C33.8 21.5 35.3 20.3 37 20.3V24.5C34.5 24.5 33 26 33 29V33H29V20Z"
      fill="#9999FF"
    />
  </svg>
);

// 5. Adobe Lightroom (Lr)
export const LightroomIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Adobe Lightroom"
  >
    <rect width="48" height="48" rx="10" fill="#001E36" />
    <rect x="1" y="1" width="46" height="46" rx="9" stroke="#31A8FF" strokeWidth="2" />
    <path d="M16 15H20V29H26V33H16V15Z" fill="#31A8FF" />
    <path
      d="M28 20H32V23.5C32.8 21.5 34.3 20.3 36 20.3V24.5C33.5 24.5 32 26 32 29V33H28V20Z"
      fill="#31A8FF"
    />
  </svg>
);

// 6. Canva
export const CanvaIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Canva"
  >
    <defs>
      <linearGradient id="canva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C4CC" />
        <stop offset="45%" stopColor="#2F66E7" />
        <stop offset="100%" stopColor="#7D2AE8" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="10" fill="url(#canva-grad)" />
    <path
      d="M31.5 16.2C29 14.5 25.5 13.8 21.8 13.8C16 13.8 11.5 18 11.5 24.5C11.5 31 16 35.2 22.2 35.2C26.5 35.2 30 33.2 32 30.4L28.8 28.2C27.3 30.1 24.9 31.4 22.2 31.4C18 31.4 15 28.3 15 24.5C15 20.7 18 17.6 21.8 17.6C24.4 17.6 26.6 18.6 28.2 20.2L31.5 16.2Z"
      fill="#FFFFFF"
    />
  </svg>
);

// 7. MS Word
export const MSWordIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Microsoft Word"
  >
    <rect width="48" height="48" rx="10" fill="#185ABD" />
    <rect x="18" y="11" width="22" height="26" rx="3" fill="#2B7CD3" />
    <path d="M8 12L24 9V39L8 36V12Z" fill="#103F91" />
    <rect x="8" y="11" width="16" height="26" rx="2" fill="#185ABD" />
    <path
      d="M11.5 18H14.5L16.2 25.5L18 18H20.5L17.5 30H14.8L13 23L11.2 30H8.5L11.5 18Z"
      fill="#FFFFFF"
    />
  </svg>
);

// 8. MS PowerPoint
export const MSPowerPointIcon: React.FC<IconProps> = ({ size = 36, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Microsoft PowerPoint"
  >
    <rect width="48" height="48" rx="10" fill="#D83B01" />
    <rect x="18" y="11" width="22" height="26" rx="3" fill="#FF5722" />
    <path d="M8 12L24 9V39L8 36V12Z" fill="#A4260C" />
    <rect x="8" y="11" width="16" height="26" rx="2" fill="#D83B01" />
    <path
      d="M12 18H16.8C18.8 18 20.2 19.4 20.2 21.5C20.2 23.6 18.8 25 16.8 25H14.2V30H12V18ZM14.2 23H16.5C17.5 23 18.2 22.4 18.2 21.5C18.2 20.6 17.5 20 16.5 20H14.2V23Z"
      fill="#FFFFFF"
    />
  </svg>
);
