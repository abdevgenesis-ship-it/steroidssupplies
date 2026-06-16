/** THCPensBulk brand palette — single source of truth for inline styles */
export const themeColors = {
  green: "#1a6b3c",
  amber: "#d97706",
  teal: "#0d9488",
  gold: "#f59e0b",
  red: "#e63946",
  yellow: "#ffd23f",
  white: "#ffffff",
} as const;

/** Forest green tint for image overlays */
export function purpleImageOverlay(opacityTop = 0.12, opacityBottom = 0.42) {
  return `linear-gradient(180deg, rgba(26,107,60,${opacityTop}), rgba(26,107,60,${opacityBottom}))`;
}

/** Green/amber fallback when no category image is available */
export function brandFallbackGradient() {
  return `linear-gradient(135deg, rgba(245,158,11,0.35) 0%, rgba(13,148,136,0.28) 45%, rgba(26,107,60,0.38) 100%)`;
}

/** Green/teal placeholder gradient */
export function brandPlaceholderGradient() {
  return `linear-gradient(135deg, rgba(13,148,136,0.28) 0%, rgba(245,158,11,0.24) 50%, rgba(26,107,60,0.28) 100%)`;
}
