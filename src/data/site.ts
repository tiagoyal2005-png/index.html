/** ACTDF — brand configuration. Single source of truth for contact + navigation. */
export const site = {
  name: "ACTDF",
  nameDisplay: "ACTDF",
  tagline: "Kota Doria · Reimagined",
  statement:
    "ACTDF brings the lightness and character of Kota Doria into a contemporary Indian wardrobe.",
  domain: "actdf.in",
  email: "care@actdf.in",
  phone: "+916687243567",
  phoneDisplay: "+91 66872 43567",
  whatsappUrl:
    "https://wa.me/916687243567?text=Hello%20ACTDF%2C%20I%27d%20like%20help%20choosing%20a%20saree.",
  address: "India · Online atelier",

  /** Placeholders — replace with real profile URLs when available. */
  socials: [
    { label: "Instagram (link coming soon)", href: "#", placeholder: true },
    { label: "Pinterest (link coming soon)", href: "#", placeholder: true },
    { label: "YouTube (link coming soon)", href: "#", placeholder: true },
  ],
} as const;

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Our Heritage", to: "/heritage" },
  { label: "Craft & Process", to: "/craft" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" },
] as const;

export const policies = [
  {
    title: "Complimentary shipping",
    body: "Free insured delivery across India. Dispatch timing is confirmed with every order.",
  },
  {
    title: "Easy 7-day returns",
    body: "Unworn pieces with tags intact can be returned within 7 days of delivery.",
  },
  {
    title: "Secure payments",
    body: "UPI, cards, net banking and cash on delivery — processed over an encrypted connection.",
  },
  {
    title: "Woven to order",
    body: "Handwoven cloth can carry slight variations that reflect the character of the loom.",
  },
] as const;
