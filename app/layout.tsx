import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

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
    default: "Oshica",
    template: "%s | Oshica",
  },
  description:
    "推し活のグッズ予約・イベント応募・当落・支出をひとつに管理するアプリ",
  applicationName: "Oshica",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Oshica",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#E9F0FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NuqsAdapter>{children}</NuqsAdapter>

        <Toaster
          position="top-center"
          richColors={false}
          toastOptions={{
            classNames: {
              toast:
                "rounded-2xl border border-oshica-border bg-white text-oshica-text shadow-lg",
              title: "text-sm font-bold",
              description: "text-xs text-oshica-primary",
              success: "border-oshica-border",
              error: "border-red-200 bg-red-50 text-red-500",
            },
          }}
        />
      </body>
    </html>
  );
}