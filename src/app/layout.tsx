import type { Metadata, Viewport } from "next";
import "./globals.css";
import LiveChatWidget from '@/components/LiveChatWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://n3xuskonceptz.com'),
  title: "N3xUs Konc3pt'z | Digital Design Studio",
  description: "Premium digital design studio specializing in custom Discord bots, Telegram bots, API development, client-server architecture, and stunning digital design. We turn your vision into reality.",
  keywords: ["digital design studio", "custom discord bots", "discord bot development", "telegram bots", "telegram automation", "API development", "custom API integration", "web development", "e-commerce development", "Next.js development", "custom web design", "CRM development", "client-server architecture", "web application development", "N3xUs Konc3pt'z", "freelance developer", "bot developer for hire"],
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
};

import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { CartProvider } from "@/components/CartProvider";
import AuthProvider from "@/components/AuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

import FloatingDigitalDesigns from "@/components/FloatingDigitalDesigns";
import CartSlideout from "@/components/CartSlideout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from 'react-hot-toast';

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
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
        </ThemeProvider>
        <Toaster 
          position="bottom-right" 
          containerStyle={{ pointerEvents: 'none' }}
          toastOptions={{ style: { pointerEvents: 'auto' } }}
        />
        <LiveChatWidget />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
