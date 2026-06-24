const HOME_HERO_BACKGROUND_URL = "/images/home-hero.png";
const HOME_HERO_BACKGROUND_ALT =
  "SteroidsSupplies — pharmaceutical-grade anabolic steroids and performance compounds, abstract geometric background";

/** Dedicated homepage hero background — separate from category card/hero images. */
export function resolveHomeHeroBackgroundUrl(): string {
  return HOME_HERO_BACKGROUND_URL;
}

export function resolveHomeHeroBackgroundAlt(): string {
  return HOME_HERO_BACKGROUND_ALT;
}
