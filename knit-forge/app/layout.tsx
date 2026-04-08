import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "KnitForge | Your All-in-One Knitting Studio",
  description: "Transform your knitting projects with AI-powered tools. Design custom patterns, convert images to charts, and bring your creative vision to life.",
  keywords: ["knitting", "pattern generator", "gauge calculator", "chart editor", "knitting tools"],
  authors: [{ name: "KnitForge" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KnitForge",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B85C38",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
