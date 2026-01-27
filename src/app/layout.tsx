import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-context";
import { WebVitals } from "@/components/WebVitals";
import "./globals.css";

const louize = localFont({
  src: [
    {
      path: "../fonts/Louize/205TF-Louize-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Louize/205TF-Louize-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-louize",
});

const fraktion = localFont({
  src: [
    {
      path: "../fonts/Fraktion/PPFraktionMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Fraktion/PPFraktionMono-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-fraktion",
});

const exposure = localFont({
  src: [
    {
      path: "../fonts/Exposure/ExposureTrial[-30].otf",
      style: "normal",
    },
    {
      path: "../fonts/Exposure/ExposureItalicTrial[-30].otf",
      style: "italic",
    },
  ],
  variable: "--font-exposure",
});

const pressuraMono = localFont({
  src: [
    {
      path: "../fonts/PressuraMono/GT-Pressura-Mono-Light-Trial.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/PressuraMono/GT-Pressura-Mono-Regular-Trial.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/PressuraMono/GT-Pressura-Mono-Bold-Trial.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-pressura-mono",
});

export const metadata: Metadata = {
  title: "David Schultz",
  description: "Interaction Designer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${louize.variable} ${fraktion.variable} ${exposure.variable} ${pressuraMono.variable}`}
      data-theme="forest"
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicon/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/favicon/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/favicon/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/favicon/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/favicon/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/favicon/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicon/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-bg-base flex min-h-screen flex-col items-center font-serif">
        <WebVitals />
        <ThemeProvider>
          <div className="w-full px-4 sm:px-16">{children}</div>

          <footer className="mt-32 flex h-[1000px] w-full flex-col bg-[#202020]"></footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
