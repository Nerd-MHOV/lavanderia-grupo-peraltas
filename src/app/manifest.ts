import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lavanderia",
    short_name: "Lavanderia",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      // {
      //   src: "/favicon.ico",
      //   sizes: "192x192",
      //   type: "image/x-icon",
      // },
      {
        src: "/images/GP.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
