export const customProducts = [
  {
    id: 10001,
    title: "Satin Hydro Body Oil",
    description: "A rich, deeply nourishing lightweight body oil that instantly sinks into the skin to leave a satin, dewy glow. Infused with cold-pressed botanical seeds and pure jasmin flower absolute.",
    price: 3400,
    rating: 4.9,
    stock: 18,
    brand: "AURA BOTANICA",
    category: "skin-care",
    thumbnail: "https://images.pexels.com/photos/26733177/pexels-photo-26733177.jpeg",
    images: [
      "https://images.pexels.com/photos/26733177/pexels-photo-26733177.jpeg"
    ],
    discountPercentage: 10
  },
  {
    id: 10002,
    title: "Luminous Resurfacing Essence",
    description: "An active-infused cellular renewing essence that gently brightens skin texture. Professional formula featuring fermented sake filtrate, niacinamide, and wild algae extract for deep skin luminosity.",
    price: 4100,
    rating: 4.88,
    stock: 12,
    brand: "ILLUME LABS",
    category: "beauty",
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800"
    ],
    discountPercentage: 15
  },
  {
    id: 10003,
    title: "Pure Comfort Over-Ear Headphones",
    description: "Premium high-fidelity active noise-canceling headphones with spatial audio, ultra-soft memory foam earcups, and a stunning brushed metal minimalist frame. Designed for supreme daily acoustic luxury.",
    price: 18900,
    rating: 4.95,
    stock: 22,
    brand: "PURE SÖNEN",
    category: "electronics",
    thumbnail: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=600",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600"
    ],
    discountPercentage: 5
  },
  {
    id: 10006,
    title: "Silken Clay Body Cleanser",
    description: "A zero-foam, high-slip luxury clay wash formulated with mineral-rich pink kaolin, colloidal oatmeal, and crushed lavender. Calm, soothing, deeply aromatherapy therapeutic.",
    price: 2400,
    rating: 4.72,
    stock: 30,
    brand: "PURE NUANCE",
    category: "beauty",
    thumbnail: "https://images.pexels.com/photos/15569179/pexels-photo-15569179.jpeg",
    images: [
      "https://images.pexels.com/photos/15569179/pexels-photo-15569179.jpeg"
    ],
    discountPercentage: 8
  }
];

export const enhanceProduct = (p) => {
  if (!p) return p;
  const title = (p.title || "").toLowerCase();
  
  let newImg = null;

  if (title.includes("satin hydro body oil")) {
    newImg = "https://images.pexels.com/photos/26733177/pexels-photo-26733177.jpeg";
  } else if (title.includes("silken clay") || title.includes("body cleanser") || title.includes("clay body cleanser")) {
    newImg = "https://images.pexels.com/photos/15569179/pexels-photo-15569179.jpeg";
  } else if (title.includes("red lipstick") || title.includes("redlipstick")) {
    newImg = "https://images.pexels.com/photos/36650872/pexels-photo-36650872.jpeg";
  } else if (title.includes("chicken") || title.includes("poultry") || title.includes("meat")) {
    newImg = "https://images.pexels.com/photos/6107716/pexels-photo-6107716.jpeg";
  } else if (title.includes("whey") || title.includes("protein")) {
    newImg = "https://images.pexels.com/photos/36429468/pexels-photo-36429468.png";
  } else if (title.includes("mascara")) {
    newImg = "https://images.pexels.com/photos/26180158/pexels-photo-26180158.jpeg";
  } else if (title.includes("eyeshadow") || title.includes("palette") || title.includes("eye shadow")) {
    newImg = "https://images.pexels.com/photos/4889720/pexels-photo-4889720.jpeg";
  } else if (title.includes("calvin klein") || title.includes("ck")) {
    newImg = "https://images.pexels.com/photos/20011541/pexels-photo-20011541.jpeg";
  } else if (title.includes("gucci bloom") || title.includes("gucci")) {
    newImg = "https://images.pexels.com/photos/19170040/pexels-photo-19170040.jpeg";
  } else if (title.includes("bed") || title.includes("mattress")) {
    newImg = "https://images.pexels.com/photos/14883343/pexels-photo-14883343.jpeg";
  } else if (title.includes("powder") || title.includes("beauty powder") || title.includes("compact")) {
    newImg = "https://images.pexels.com/photos/8129911/pexels-photo-8129911.jpeg";
  } else if (title.includes("lip gloss") || title.includes("lipgloss") || title.includes("gloss")) {
    newImg = "https://images.pexels.com/photos/29229006/pexels-photo-29229006.jpeg";
  } else if (title.includes("lipstick") || title.includes("lip stick") || title.includes("lip liner")) {
    newImg = "https://images.pexels.com/photos/12503617/pexels-photo-12503617.jpeg";
  } else if (title.includes("perfume") || title.includes("chanel") || title.includes("fragrance") || title.includes("cologne") || title.includes("elixir")) {
    newImg = "https://images.pexels.com/photos/23230643/pexels-photo-23230643.jpeg";
  } else if (title.includes("watch") && (title.includes("men") || p.category?.includes("mens-watches") || p.category?.includes("watches") || p.category?.includes("fashion"))) {
    newImg = "https://images.pexels.com/photos/14525782/pexels-photo-14525782.jpeg";
  } else if (title.includes("beard") || title.includes("grooming") || title.includes("shaving") || title.includes("clipper")) {
    newImg = "https://images.pexels.com/photos/14649338/pexels-photo-14649338.jpeg";
  } else if ((title.includes("shoe") || title.includes("laceup") || title.includes("sneaker") || title.includes("leather shoes")) && (title.includes("men") || p.category?.includes("mens-shoes") || p.category?.includes("shoes") || p.category?.includes("fashion"))) {
    newImg = "https://images.pexels.com/photos/6764994/pexels-photo-6764994.jpeg";
  }

  if (newImg) {
    return {
      ...p,
      thumbnail: newImg,
      images: [newImg, ...(p.images ? p.images.filter(x => x !== newImg) : [])]
    };
  }

  return p;
};
