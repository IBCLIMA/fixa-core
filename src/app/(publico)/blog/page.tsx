import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { ArrowRight, Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/landing/animated-section";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Blog — Gestión de talleres mecánicos",
  description: "Artículos sobre gestión de talleres, software, marketing para mecánicos, avisos ITV, y todo lo que necesitas para profesionalizar tu taller.",
  alternates: { canonical: "https://fixa.es/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
    <Navbar />
    <div className="mx-auto max-w-4xl px-6 py-20">
      <AnimatedSection className="mb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
          Blog
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
          Gestión de talleres mecánicos
        </h1>
        <p className="text-stone-500 mt-4 text-lg">
          Consejos, guías y herramientas para profesionalizar tu taller.
        </p>
      </AnimatedSection>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <article className="rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 text-sm text-stone-400 mb-3">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</time>
                <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">{post.category}</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">{post.title}</h2>
              <p className="text-stone-500 mt-2 text-sm leading-relaxed">{post.description}</p>
              <div className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold mt-4 group-hover:gap-2.5 transition-all">
                Leer artículo <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
    <Footer />
    </div>
  );
}
