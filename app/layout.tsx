import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

const siteUrl = "https://oshica.vercel.app";
const googleAnalyticsId = "G-6C60BVZGHR";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "推し活管理アプリ Oshica｜推し活の締切、もう忘れない。",
    template: "%s | Oshica",
  },

  description:
    "イベント応募・グッズ予約・当落・支出を、推しごとにまとめて管理できる推し活管理アプリです。無料ですぐに始められます。",

  applicationName: "Oshica",

  keywords: [
    "Oshica",
    "推し活",
    "推し活管理",
    "推し活アプリ",
    "イベント管理",
    "グッズ管理",
    "当落管理",
    "支出管理",
    "オタ活",
    "アイドル",
    "VTuber",
    "アニメ",
    "ゲーム",
  ],

  authors: [
    {
      name: "Oshica",
    },
  ],

  creator: "Oshica",
  publisher: "Oshica",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "Oshica",
    title: "推し活管理アプリ Oshica｜推し活の締切、もう忘れない。",
    description:
      "イベント応募・グッズ予約・当落・支出を、推しごとにまとめて管理できる推し活管理アプリです。",
  },

  twitter: {
    card: "summary",
    title: "推し活管理アプリ Oshica｜推し活の締切、もう忘れない。",
    description:
      "イベント応募・グッズ予約・当落・支出を、推しごとにまとめて管理できる推し活管理アプリです。",
  },

  verification: {
    google: "A8CptqgmHZnm7g-Sb61ZE2brRpUFXFDmH1ArPjnujuw",
  },

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Oshica",
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  category: "productivity",
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
      <body className="flex min-h-full flex-col">
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

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag("js", new Date());
            gtag("config", "${googleAnalyticsId}");
          `}
        </Script>
      </body>
    </html>
  );
}