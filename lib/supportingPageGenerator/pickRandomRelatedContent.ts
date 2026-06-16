/** Deterministic pseudo-random from seed string (stable re-runs per slug). */
function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRandomItems<T>(items: T[], count: number, seed: string): T[] {
  if (items.length === 0) return [];
  const take = Math.min(count, items.length);
  const rng = mulberry32(hashSeed(seed));
  const pool = [...items];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, take);
}

export function toSanityReferences(ids: string[]) {
  return ids.map((_ref) => ({ _type: "reference" as const, _ref }));
}

export type RelatedContentPools = {
  categoryIds: string[];
  productIds: string[];
};

export function pickRandomRelatedContent(pools: RelatedContentPools, slug: string) {
  const categoryIds = pickRandomItems(pools.categoryIds, 4, `${slug}-categories`);
  const productIds = pickRandomItems(pools.productIds, 4, `${slug}-products`);

  return {
    categories: toSanityReferences(categoryIds),
    relatedProducts: toSanityReferences(productIds),
    categoryIds,
    productIds,
  };
}
