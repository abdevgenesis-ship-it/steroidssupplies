/** SteroidsSupplies brand palette — single source of truth for inline styles */
export const themeColors = {
  crimson: "#c41e3a",
  red: "#ef4444",
  rose: "#f87171",
  darkRed: "#7f1d1d",
  black: "#09090b",
  surface: "#0f0e0e",
  white: "#ffffff",
} as const;

/** Crimson tint for image overlays */
export function purpleImageOverlay(opacityTop = 0.12, opacityBottom = 0.42) {
  return `linear-gradient(180deg, rgba(196,30,58,${opacityTop}), rgba(196,30,58,${opacityBottom}))`;
}

/** Crimson/red fallback when no category image is available */
export function brandFallbackGradient() {
  return `linear-gradient(135deg, rgba(196,30,58,0.30) 0%, rgba(239,68,68,0.22) 45%, rgba(127,29,29,0.35) 100%)`;
}

/** Dark red placeholder gradient */
export function brandPlaceholderGradient() {
  return `linear-gradient(135deg, rgba(127,29,29,0.28) 0%, rgba(196,30,58,0.20) 50%, rgba(239,68,68,0.24) 100%)`;
}
