import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const narnia = localFont({
  src: "../fonts/Narnia.otf",
  variable: "--font-narnia",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abhro-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Abhro Saha — Digital Artist & Visual Storyteller",
  description:
    "Portfolio of Abhro Saha: Drawing, Graphic Design, 3D Modeling with Blender, and Visual Storytelling. Bringing creations to life one creation at a time.",
  keywords: [
    "Abhro Saha",
    "Portfolio",
    "Graphic Design",
    "Blender",
    "3D Modeling",
    "Digital Art",
    "Animation",
    "Visual Storytelling",
  ],
  authors: [{ name: "Abhro Saha" }],
  creator: "Abhro Saha",
  openGraph: {
    title: "Abhro Saha — Digital Artist & Visual Storyteller",
    description: "Bringing creations to life one creation at a time.",
    type: "website",
    locale: "en_US",
    siteName: "Abhro Saha Portfolio",
    images: [
      {
        url: "/assets/abhro.png",
        width: 1004,
        height: 1004,
        alt: "Abhro Saha — Digital Artist & Visual Storyteller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhro Saha — Digital Artist & Visual Storyteller",
    description: "Bringing creations to life one creation at a time.",
    images: ["/assets/abhro.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/abhro.png",
    apple: "/assets/abhro.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#c4c4c4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${narnia.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
