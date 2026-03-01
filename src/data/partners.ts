export interface Partner {
  slug: string;
  name: string;
  role: string;
  bio: string;
  blurb: string;
  photo?: string;
  email?: string;
  website?: string;
  websiteLabel?: string;
  twitter?: string;
  twitterLabel?: string;
}

export const partners: Partner[] = [
  {
    slug: "ryanm",
    name: "Ryan McComb",
    role: "Founder & Partner",
    bio: "The world's foremost expert on low-liquidity House prediction markets (kind of true, though). Ryan is a high school sophomore at Evanston Township High School with a background in election forecasting, prediction markets, and data analysis. He is currently a Student Fellow at VoteHub, previously built IL9CAST, an open-source political forecasting model, and was the Volunteer Finance Lead for Biss for Congress.",
    blurb:
      "ETHS sophomore. Election forecasting, prediction markets, and data analysis.",
    photo: "/images/partners/ryanm.jpg",
    email: "ryan@theheatsheet.com",
    website: "https://rjmccomb.xyz",
    websiteLabel: "rjmccomb.xyz",
    twitter: "https://x.com/bayes_pr",
    twitterLabel: "@bayes_pr",
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}

export function getAllPartnerSlugs(): string[] {
  return partners.map((p) => p.slug);
}
