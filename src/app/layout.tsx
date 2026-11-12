import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { site } from "@/config/site";
import ParticleField from "@/components/experience/ParticleFieldLazy";
import Motion from "@/components/experience/Motion";
import Loader from "@/components/experience/Loader";
import Cursor from "@/components/experience/Cursor";
import "./globals.css";

const instrumentSerif = localFont({
  src: [
    { path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", style: "italic", weight: "400" },
    { path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", style: "normal", weight: "400" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Shohrux — Developer & AI Product Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#06080E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Lets the loader render only when JavaScript runs. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Loader />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ParticleField />
        {children}
        <Cursor />
        <Motion />
      </body>
    </html>
  );
}
