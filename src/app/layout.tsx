import type { Metadata, Viewport } from "next";
import { Italiana, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const italiana = Italiana({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // Support notched devices (iPhone, Android)
  themeColor: "#f9f2ee",
};

export const metadata: Metadata = {
  title: {
    default: "Shimmy Beauty Studio Singapore | Brows & Press-On Nails",
    template: "%s | Shimmy",
  },
  description:
    "Eyebrow embroidery, nano brows, and handcrafted press-on nails in Singapore. Book your consultation or shop nail collections online.",
  keywords: ['eyebrow embroidery Singapore', 'nano brows Singapore', 'press on nails Singapore', 'ombre powder brows Singapore'],
  openGraph: {
    title: "Shimmy — Beauty Studio Singapore",
    description:
      "Brows shaped for your face. Nails made by hand.",
    url: "https://shimmyhands.com",
    type: "website",
    siteName: "Shimmy",
    locale: "en_SG",
    /* TODO: Add your OG image URL */
    // images: [{ url: "https://shimmyhands.com/og-image.jpg", width: 1200, height: 630 }],
  },
  metadataBase: new URL("https://shimmyhands.com"),
  icons: {
    icon: "/favicon.svg",
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
      className={`${italiana.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col safe-bottom">
        <GoogleAnalytics />
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
