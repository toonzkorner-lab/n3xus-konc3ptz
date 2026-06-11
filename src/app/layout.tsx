import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N3xUs Konc3pt'z | Digital Design Studio",
  description: "Premium digital design studio specializing in custom Discord bots, Telegram bots, API development, client-server architecture, and stunning digital design. We turn your vision into reality.",
  keywords: ["digital design", "discord bots", "telegram bots", "API development", "web development", "client-server architecture", "N3xUs Konc3pt'z"],
  authors: [{ name: "N3xUs Konc3pt'z" }],
  openGraph: {
    title: "N3xUs Konc3pt'z | Digital Design Studio",
    description: "Premium digital design studio specializing in custom bots, API development, and stunning digital design.",
    type: "website",
    locale: "en_US",
    siteName: "N3xUs Konc3pt'z",
  },
  twitter: {
    card: "summary_large_image",
    title: "N3xUs Konc3pt'z | Digital Design Studio",
    description: "Premium digital design studio specializing in custom bots, API development, and stunning digital design.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { CartProvider } from "@/components/CartProvider";
import AuthProvider from "@/components/AuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import CartSlideout from "@/components/CartSlideout";
import FloatingDigitalDesigns from "@/components/FloatingDigitalDesigns";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="cosmic-bg">
          <div className="stars"></div>
        </div>
        <FloatingDigitalDesigns />
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartSlideout />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
