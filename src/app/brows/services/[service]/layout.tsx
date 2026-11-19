import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BROW_SERVICES, getBrowService, serviceKeys } from "@/lib/brow-services";
import { en } from "@/lib/i18n-en";
import { pageMeta, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ service: string }> };

export function generateStaticParams() {
  return BROW_SERVICES.map((s) => ({ service: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const s = getBrowService(service);
  if (!s) return { title: "Service not found", robots: { index: false } };
  const meta = pageMeta({
    title: s.seoTitle,
    description: s.seoDescription,
    path: `/brows/services/${s.slug}`,
    image: s.image,
  });
  return { ...meta, title: { absolute: `${s.seoTitle} | Shimmy` } };
}

export default async function ServiceLayout({ params, children }: Props & { children: React.ReactNode }) {
  const { service } = await params;
  const s = getBrowService(service);
  if (!s) notFound();
  const k = serviceKeys(s);
  const url = `${SITE_URL}/brows/services/${s.slug}`;
  const price = Number(en[k.price].match(/S\$(\d+)/)?.[1]);

  // Structured data so search results can show the service, its starting price and FAQs.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: en[k.title],
      description: en[k.desc],
      url,
      areaServed: { "@type": "City", name: "Singapore" },
      provider: { "@type": "BeautySalon", name: "Shimmy Beauty Studio", url: SITE_URL },
      ...(price
        ? { offers: { "@type": "Offer", priceCurrency: "SGD", price, priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: "SGD" } } }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: k.faqs.map((f) => ({
        "@type": "Question",
        name: en[f.q],
        acceptedAnswer: { "@type": "Answer", text: en[f.a] },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Brows", item: `${SITE_URL}/brows` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/brows/services` },
        { "@type": "ListItem", position: 3, name: en[k.title], item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {children}
    </>
  );
}
