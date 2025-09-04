import type React from "react";
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Atharv Travel - Discover Your Next Adventure",
  description:
    "Professional travel booking platform offering curated destinations, seamless booking experience, and unforgettable journeys worldwide.",
  generator: "v0.app",
  keywords:
    "travel, booking, destinations, vacation, adventure, tours, packages",
  authors: [{ name: "Atharv Travel" }],
  openGraph: {
    title: "Atharv Travel - Discover Your Next Adventure",
    description:
      "Professional travel booking platform offering curated destinations and unforgettable journeys.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
    >
      <body cz-shortcut-listen="true">
        <TRPCReactProvider>
          {children}
          <Toaster position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
