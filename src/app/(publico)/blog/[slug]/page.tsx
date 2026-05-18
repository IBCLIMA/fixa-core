import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://fixa.es/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://fixa.es/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "FIXA" },
    publisher: { "@type": "Organization", name: "FIXA", url: "https://fixa.es" },
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Volver al blog
      </Link>

      <div className="flex items-center gap-3 text-sm text-stone-400 mb-4">
        <Calendar className="h-4 w-4" />
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</time>
        <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">{post.category}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 mb-4">{post.title}</h1>
      <p className="text-lg text-stone-500 mb-8">{post.description}</p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
              <Tag className="h-3 w-3" /> {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-stone prose-lg max-w-none">
        <MDXContent code={post.body} />
      </div>

      {/* CTA at bottom */}
      <div className="mt-16 rounded-2xl bg-stone-900 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">¿Listo para digitalizar tu taller?</h3>
        <p className="text-stone-400 mb-6">14 días gratis. Sin tarjeta de crédito.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-400 transition-colors">
          Probar FIXA gratis
        </Link>
      </div>
    </article>
  );
}
