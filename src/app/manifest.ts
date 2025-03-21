import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lavanderia",
    short_name: "Lavanderia",
    description: "Lavanderia",
    start_url: "/",
    display: "fullscreen",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "512x512",
        type: "image/x-icon",
      },
    ],
  };
}
