import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://fixa.es";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/inicio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/sign-up`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terminos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/aviso-legal`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Dynamic content pages - import at build time
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const { posts, features, cities, comparisons } = await import("#site/content");

    const blogPages = posts
      .filter((p: any) => p.published)
      .map((p: any) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    const featurePages = features.map((f: any) => ({
      url: `${baseUrl}/funciones/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const cityPages = cities.map((c: any) => ({
      url: `${baseUrl}/taller-${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const comparisonPages = comparisons.map((c: any) => ({
      url: `${baseUrl}/vs/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    dynamicPages = [...blogPages, ...featurePages, ...cityPages, ...comparisonPages];
  } catch {
    // Content not built yet - return only static pages
  }

  return [...staticPages, ...dynamicPages];
}
