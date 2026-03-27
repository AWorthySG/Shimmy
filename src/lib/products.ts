export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number; // in SGD (launch price)
  compareAtPrice?: number; // U.P.
  description: string;
  collection: string;
  collectionHandle: string;
  tags: string[];
  features: string[];
  colours?: string[];
  hardware?: string[];
  images: string[]; // paths in /public
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image?: string; // hero image for the collection
}

export const collections: Collection[] = [
  {
    handle: "christmas-wishes",
    title: "Christmas Wishes",
    description:
      "Festive sparkle meets handpainted artistry. Ultra-reflective glitter and seasonal designs in Mulled Wine or Evergreen.",
    image: "/images/nails/xmas-flatlay-1.jpg",
  },
  {
    handle: "yule-dreams",
    title: "Yule Dreams",
    description:
      "Dark, elegant, and crystalline. 3D nail art with crystals, mini caviar, and a luxurious matte finish.",
    image: "/images/nails/yule-onhand-1.jpg",
  },
  {
    handle: "sweater-weather",
    title: "Sweater Weather",
    description:
      "Cosy 3D nail art in pastel tones — Baby Blue, Sweet Mint, and Milky Lavender. The collection that started it all.",
    image: "/images/nails/sweater-flatlay-1.jpg",
  },
  {
    handle: "lovers-heartbeat",
    title: "Lovers' Heartbeat",
    description:
      "Dancing illusions and magnetic cat-eye effects that shift and shimmer with every movement. Bold and mesmerizing.",
    image: "/images/nails/lovers-flatlay-5.jpg",
  },
  {
    handle: "ingenue",
    title: "Ingénue",
    description:
      "Delicate, feminine, and effortlessly chic. Handpainted nail art with 3D details in Blush, Nude, and Peach.",
    image: "/images/nails/ingenue-all-variants.jpg",
  },
];

export const products: Product[] = [
  // ─── Christmas Wishes ───
  {
    id: "cw-001",
    handle: "candy-canes-evergreen",
    title: "Candy Canes — Evergreen",
    price: 45,
    compareAtPrice: 49.90,
    description:
      "Festive emerald green with ultra-reflective glitter and hand-painted candy cane accents. Three unique designs per set.",
    collection: "Christmas Wishes",
    collectionHandle: "christmas-wishes",
    tags: ["festive", "green", "glitter", "handpainted"],
    features: ["3 Unique Designs", "Handpainted Nail Art", "Ultra-Reflective Glitter"],
    colours: ["Evergreen"],
    images: ["/images/nails/xmas-flatlay-3.jpg", "/images/nails/xmas-flatlay-1.jpg"],
  },
  {
    id: "cw-002",
    handle: "candy-canes-mulled-wine",
    title: "Candy Canes — Mulled Wine",
    price: 45,
    compareAtPrice: 49.90,
    description:
      "Deep mulled wine red with sparkle snowflake patterns and festive accents. Rich, warm, and undeniably festive.",
    collection: "Christmas Wishes",
    collectionHandle: "christmas-wishes",
    tags: ["festive", "red", "glitter", "snowflake"],
    features: ["3 Unique Designs", "Handpainted Nail Art", "Ultra-Reflective Glitter"],
    colours: ["Mulled Wine"],
    images: ["/images/nails/xmas-flatlay-2.jpg", "/images/nails/xmas-flatlay-1.jpg"],
  },

  // ─── Yule Dreams ───
  {
    id: "yd-001",
    handle: "yule-dreams-midnight-silver",
    title: "Yule Dreams — Midnight with Silver",
    price: 53.90,
    compareAtPrice: 59.90,
    description:
      "Deep midnight blue matte finish with silver crystal snowflake accents and mini caviar details. Five unique designs per set.",
    collection: "Yule Dreams",
    collectionHandle: "yule-dreams",
    tags: ["winter", "blue", "matte", "crystals", "3d"],
    features: ["5 Unique Designs", "3D Nail Art", "Crystals & Mini Caviar", "Matte Finish"],
    colours: ["Midnight"],
    hardware: ["Silver"],
    images: ["/images/nails/yule-onhand-2.jpg", "/images/nails/yule-onhand-1.jpg"],
  },
  {
    id: "yd-002",
    handle: "yule-dreams-amethyst-gold",
    title: "Yule Dreams — Amethyst with Gold",
    price: 53.90,
    compareAtPrice: 59.90,
    description:
      "Rich amethyst plum with gold star and snowflake accents. Matte finish with 3D crystal details and mini caviar.",
    collection: "Yule Dreams",
    collectionHandle: "yule-dreams",
    tags: ["winter", "purple", "matte", "crystals", "3d", "gold"],
    features: ["5 Unique Designs", "3D Nail Art", "Crystals & Mini Caviar", "Matte Finish"],
    colours: ["Amethyst"],
    hardware: ["Gold"],
    images: ["/images/nails/yule-onhand-1.jpg", "/images/nails/yule-onhand-2.jpg"],
  },

  // ─── Sweater Weather — Christmas Edition ───
  {
    id: "sw-001",
    handle: "sweater-weather-xmas-milky-lavender",
    title: "Sweater Weather Christmas — Milky Lavender with Rosé",
    price: 68,
    compareAtPrice: 75.90,
    description:
      "Soft milky lavender with hand-painted gingerbread, snowman, and Christmas ornament details. Five unique 3D designs.",
    collection: "Sweater Weather",
    collectionHandle: "sweater-weather",
    tags: ["christmas", "lavender", "3d", "handpainted"],
    features: ["5 Unique Designs", "3D Nail Art"],
    colours: ["Milky Lavender"],
    hardware: ["Rosé"],
    images: ["/images/nails/xmas-flatlay-1.jpg"],
  },

  // ─── Sweater Weather — Classic Edition ───
  {
    id: "sw-002",
    handle: "sweater-weather-baby-blue-silver",
    title: "Sweater Weather Classic — Baby Blue with Silver",
    price: 62,
    compareAtPrice: 69.90,
    description:
      "Icy baby blue with silver pearl details and 3D texture art. Delicate, wintry, and stunningly detailed.",
    collection: "Sweater Weather",
    collectionHandle: "sweater-weather",
    tags: ["pastel", "blue", "3d", "silver"],
    features: ["5 Unique Designs", "3D Nail Art"],
    colours: ["Baby Blue"],
    hardware: ["Silver"],
    images: ["/images/nails/sweater-flatlay-1.jpg", "/images/nails/sweater-flatlay-2.jpg", "/images/nails/sweater-lifestyle-1.jpg", "/images/nails/sweater-flatlay-3.jpg"],
  },
  {
    id: "sw-003",
    handle: "sweater-weather-sweet-mint-gold",
    title: "Sweater Weather Classic — Sweet Mint with Gold",
    price: 62,
    compareAtPrice: 69.90,
    description:
      "Fresh sweet mint with gold foil accents and 3D texture details. Elegant and effortlessly stylish.",
    collection: "Sweater Weather",
    collectionHandle: "sweater-weather",
    tags: ["pastel", "mint", "3d", "gold"],
    features: ["5 Unique Designs", "3D Nail Art"],
    colours: ["Sweet Mint"],
    hardware: ["Gold"],
    images: ["/images/nails/sweater-flatlay-4.jpg", "/images/nails/sweater-lifestyle-2.jpg", "/images/nails/sweater-onhand-1.jpg", "/images/nails/ingenue-1.jpg"],
  },

  // ─── Lovers' Heartbeat ───
  {
    id: "lh-001",
    handle: "lovers-heartbeat-cool-dawn",
    title: "Lovers' Heartbeat — Cool Dawn",
    price: 57,
    compareAtPrice: 62.90,
    description:
      "Mesmerizing cool-toned cat-eye effect with dancing illusions that shift from deep emerald to midnight blue. Seven unique designs.",
    collection: "Lovers' Heartbeat",
    collectionHandle: "lovers-heartbeat",
    tags: ["cat-eye", "dramatic", "shimmer", "illusion"],
    features: ["7 Unique Designs", "Dancing Illusions", "Cat-Eye"],
    colours: ["Cool Dawn"],
    images: ["/images/nails/lovers-flatlay-5.jpg", "/images/nails/lovers-flatlay-6.jpg", "/images/nails/lovers-onhand-1.jpg", "/images/nails/lovers-onhand-2.jpg"],
  },
  {
    id: "lh-002",
    handle: "lovers-heartbeat-warm-sunset",
    title: "Lovers' Heartbeat — Warm Sunset",
    price: 57,
    compareAtPrice: 62.90,
    description:
      "Warm-toned cat-eye with golden, magenta, and violet illusions. Each nail catches light differently — truly magnetic.",
    collection: "Lovers' Heartbeat",
    collectionHandle: "lovers-heartbeat",
    tags: ["cat-eye", "dramatic", "shimmer", "illusion", "warm"],
    features: ["7 Unique Designs", "Dancing Illusions", "Cat-Eye"],
    colours: ["Warm Sunset"],
    images: ["/images/nails/lovers-flatlay-3.jpg", "/images/nails/lovers-flatlay-4.jpg", "/images/nails/lovers-warm-onhand-1.jpg", "/images/nails/lovers-warm-onhand-2.jpg"],
  },

  // ─── Ingénue ───
  {
    id: "in-001",
    handle: "ingenue-peach-white-gold",
    title: "Ingénue — Peach with White Accent & Gold Glitter",
    price: 49.90,
    compareAtPrice: 54.90,
    description:
      "Delicate peach base with hand-painted white marble accents and gold glitter details. Three unique designs with 3D nail art.",
    collection: "Ingénue",
    collectionHandle: "ingenue",
    tags: ["feminine", "peach", "handpainted", "3d", "gold"],
    features: ["3 Unique Designs", "Handpainted Nail Art", "3D Nail Art"],
    colours: ["Peach"],
    hardware: ["Gold Glitter"],
    images: ["/images/nails/ingenue-peach-hex.jpg", "/images/nails/ingenue-flatlay-cat.jpg", "/images/nails/ingenue-lifestyle.jpg"],
  },
  {
    id: "in-002",
    handle: "ingenue-nude-white-rose",
    title: "Ingénue — Nude with White Accent & Rosé Glitter",
    price: 49.90,
    compareAtPrice: 54.90,
    description:
      "Soft nude tones with white marbling and rosé glitter accents. Feminine, refined, and effortlessly elegant.",
    collection: "Ingénue",
    collectionHandle: "ingenue",
    tags: ["feminine", "nude", "handpainted", "3d", "rose"],
    features: ["3 Unique Designs", "Handpainted Nail Art", "3D Nail Art"],
    colours: ["Nude"],
    hardware: ["Rosé Glitter"],
    images: ["/images/nails/ingenue-2.jpg", "/images/nails/ingenue-3.jpg", "/images/nails/ingenue-all-variants.jpg"],
  },
  {
    id: "in-003",
    handle: "ingenue-blush-black-silver",
    title: "Ingénue — Blush with Black Accent & Silver Glitter",
    price: 49.90,
    compareAtPrice: 54.90,
    description:
      "Blush pink meets black accent art with silver glitter details. The bold sibling in the Ingénue family — dramatic yet refined.",
    collection: "Ingénue",
    collectionHandle: "ingenue",
    tags: ["feminine", "blush", "black", "handpainted", "3d", "silver"],
    features: ["3 Unique Designs", "Handpainted Nail Art", "3D Nail Art"],
    colours: ["Blush"],
    hardware: ["Silver Glitter"],
    images: ["/images/nails/ingenue-1.jpg", "/images/nails/ingenue-all-variants.jpg", "/images/nails/ingenue-flatlay-cat.jpg"],
  },
];

// ─── Helper functions ───

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.handle === slug);
}

export function getProductsByCollection(collectionHandle: string): Product[] {
  return products.filter((p) => p.collectionHandle === collectionHandle);
}

export function getCollectionByHandle(handle: string): Collection | undefined {
  return collections.find((c) => c.handle === handle);
}
