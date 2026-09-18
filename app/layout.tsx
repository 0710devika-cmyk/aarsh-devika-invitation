import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SITE_URL } from "@/lib/constants";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Wedding Invitation Aarsh & Devika — 3 December 2026",
  description:
    "We invite you to witness our wedding and offer your blessings. Saturday, December 3, 2026,",
  keywords: [
    "wedding invitation",
    "wedding",
    "Aarsh Trivedi",
    "Devika Nair",
    "wedding invitation",
    "Lonavala",
    "2026",
    "#AarshDevika2026",
  ],
  authors: [{ name: "Arga & Nimas" }],
  creator: "Arga & Nimas",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
  },
  robots: {
    index: true,
    follow: false,
    googleBot: {
      index: true,
      follow: false,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Wedding Aarsh & Devika — 3 December 2026",
    description:
      "We invite you to witness our wedding and offer your blessings. Saturday, December 3, 2026,",
    siteName: "Wedding Invitation Aarsh & Devika",
    locale: "id_ID",
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Pernikahan Aarsh & Devika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Aarsh & Devika — 3 December 2026",
    description:
      "We invite you to witness our wedding and offer your blessings. Saturday, December 3, 2026,",
    images: [`${SITE_URL}/images/og-image.png`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8E7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0A08" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
