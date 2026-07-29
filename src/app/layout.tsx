import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FixItNow | Trusted Home Services",
    template: "%s | FixItNow",
  },
  description:
    "FixItNow connects you with trusted, skilled, and verified home service professionals for reliable services at your convenience.",
  keywords: [
    "FixItNow",
    "home services",
    "technicians",
    "home repair",
    "service marketplace",
  ],
  authors: [{ name: "FixItNow" }],
  creator: "FixItNow",
  applicationName: "FixItNow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}