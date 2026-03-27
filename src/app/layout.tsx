import type { Metadata, Viewport } from "next";
import { Italiana, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

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
    default: "Shimmy — Beauty, Redefined",
    template: "%s | Shimmy",
  },
  description:
    "Brow artistry and handcrafted press-on nails in Singapore. Two art forms, one philosophy — every detail shaped around you.",
  /* TODO: Replace with your actual OG image */
  openGraph: {
    title: "Shimmy — Beauty, Redefined",
    description:
      "Brow artistry and handcrafted press-on nails in Singapore. From brows that frame your face to nails that tell your story.",
    type: "website",
    locale: "en_SG",
    /* TODO: Add your OG image URL */
    // images: [{ url: "https://shimmybrows.com/og-image.jpg", width: 1200, height: 630 }],
  },
  /* TODO: Replace with your actual domain */
  // metadataBase: new URL("https://shimmybrows.com"),
  icons: {
    /* TODO: Add your favicon */
    // icon: "/favicon.ico",
    // apple: "/apple-touch-icon.png",
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
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
