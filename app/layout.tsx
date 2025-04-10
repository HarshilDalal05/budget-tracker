import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RootThemeProvider } from "@/components/providers/RootProviders";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PennyWise",
  description: "Be smart with your money – be PennyWise!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className="dark"
        style={{ colorScheme: "dark" }}
      >
        <body className={`${geistSans.variable} ${geistMono.variable} `}>
          <Toaster richColors position="bottom-right"/>
          <RootThemeProvider>{children}</RootThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
