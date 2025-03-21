import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lavanderia",
    short_name: "Lavanderia",
    description: "Lavanderia",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "192x192",
        type: "image/x-icon",
      },
      {
        src: "/imagens/GP.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
