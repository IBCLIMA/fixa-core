import { defineConfig, defineCollection, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s.object({
    title: s.string().max(120),
    description: s.string().max(260),
    date: s.isodate(),
    published: s.boolean().default(true),
    slug: s.slug("blog"),
    image: s.string().optional(),
    author: s.string().default("FIXA"),
    category: s.enum(["gestion", "marketing", "legal", "tecnologia", "consejos"]),
    tags: s.array(s.string()).default([]),
    body: s.mdx(),
  }),
});

const features = defineCollection({
  name: "Feature",
  pattern: "funciones/**/*.mdx",
  schema: s.object({
    title: s.string().max(120),
    description: s.string().max(260),
    slug: s.slug("funciones"),
    icon: s.string(),
    color: s.string().default("orange"),
    order: s.number().default(0),
    body: s.mdx(),
  }),
});

const cities = defineCollection({
  name: "City",
  pattern: "ciudades/**/*.mdx",
  schema: s.object({
    city: s.string(),
    region: s.string(),
    slug: s.slug("ciudades"),
    population: s.number().optional(),
    talleres: s.number().optional(),
    body: s.mdx(),
  }),
});

const comparisons = defineCollection({
  name: "Comparison",
  pattern: "comparativas/**/*.mdx",
  schema: s.object({
    title: s.string().max(120),
    description: s.string().max(260),
    slug: s.slug("comparativas"),
    competitor: s.string(),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, features, cities, comparisons },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
