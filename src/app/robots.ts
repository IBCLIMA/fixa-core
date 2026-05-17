import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/configuracion", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: "https://fixa.es/sitemap.xml",
  };
}
