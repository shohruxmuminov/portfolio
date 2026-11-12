/**
 * Site-wide configuration: metadata, contact destinations and feature flags.
 *
 * Contact fields are intentionally empty. Anything left as "" is hidden from
 * the UI — never fill these with placeholder or guessed values.
 */
type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  contact: {
    email: string;
    links: { github: string; linkedin: string; x: string; instagram: string };
  };
  availability: string | null;
  footerCredit: string | null;
};

export const site: SiteConfig = {
  /** Public display name. Switch to "Shohrux Muminov" only if approved. */
  name: "Shohrux",
  title: "Shohrux — Developer & AI Product Builder",
  description:
    "Shohrux is a developer from Uzbekistan exploring web development, AI-powered software, desktop applications and interactive 3D experiences.",
  /** Set to the deployed origin (e.g. "https://example.com") once known. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",

  contact: {
    /** Public contact email. Leave empty until Shohrux supplies one. */
    email: "",
    links: {
      /** Confirm the public profile URL before adding it. */
      github: "",
      linkedin: "",
      x: "",
      instagram: "",
    },
  },

  /**
   * Optional availability label shown in the navigation. Leave null unless
   * it is current and true (e.g. "Open to collaborations").
   */
  availability: null,

  /** Show "Designed and built by …" in the footer only when it is accurate. */
  footerCredit: null,
};

export type SocialKey = keyof typeof site.contact.links;

export const socialLabels: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
};

/** Contact destinations that actually exist, in display order. */
export function getContactLinks() {
  const links: { label: string; href: string; external: boolean }[] = [];
  if (site.contact.email) {
    links.push({ label: "Email", href: `mailto:${site.contact.email}`, external: false });
  }
  (Object.keys(site.contact.links) as SocialKey[]).forEach((key) => {
    const href = site.contact.links[key];
    if (href) links.push({ label: socialLabels[key], href, external: true });
  });
  return links;
}
