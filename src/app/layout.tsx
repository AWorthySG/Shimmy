import { SITE_URL, SITE_NAME } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { Italiana, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { PageTransition } from "@/components/PageTransition";
import WelcomeBanner from "@/components/WelcomeBanner";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SocialProofToast from "@/components/SocialProofToast";
import SpinWheel from "@/components/SpinWheel";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PageViewTracker from "@/components/PageViewTracker";

const italiana = Italiana({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-body",
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
  themeColor: "#536442",
};

export const metadata: Metadata = {
  alternates: { canonical: '/' },
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
    url: "https://www.shimmyhands.com",
    type: "website",
    siteName: "Shimmy",
    locale: "en_SG",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shimmyhands',
  },
  icons: {
    icon: "/favicon.svg",
  },
};

// Local-business data for search engines. Add "address" (PostalAddress) and
// "geo" once the studio's public address is confirmed.
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Shimmy Beauty Studio",
  alternateName: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  telephone: "+65 8930 8973",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "37 Grace Walk, Verdana Villas",
    addressLocality: "Singapore",
    addressCountry: "SG",
  },
  areaServed: { "@type": "City", name: "Singapore" },
  sameAs: ["https://instagram.com/shimmyhands.shop"],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "18:00" },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <GoogleAnalytics />
        <Providers>
          <WelcomeBanner />
          <Navbar />
          <main className="flex-1 overflow-x-clip"><PageTransition>{children}</PageTransition></main>
          <Footer />
          <CookieConsent />
          <WhatsAppFloat />
          <ScrollToTop />
          <ExitIntentPopup />
          <SocialProofToast />
          <SpinWheel />
          <PageViewTracker />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
