import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SteroidsSupplies",
    short_name: "SteroidsSupplies",
    description:
      "Buy certified anabolic steroids online. B2C & B2B wholesale with guaranteed 48h international delivery.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#c41e3a",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
