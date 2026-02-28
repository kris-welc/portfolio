import type { Metadata } from "next";
import { Chakra_Petch, Rajdhani, Share_Tech_Mono } from "next/font/google";
import { ErrorSuppressor } from "@/components/error-suppressor";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Kris Welc",
  description:
    "Autonomous AI systems, algorithmic trading, and macro intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${chakraPetch.variable} ${rajdhani.variable} ${shareTechMono.variable} antialiased scanlines grain vignette min-h-screen`}
      >
        <ErrorSuppressor />
        <div className="wasteland-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
