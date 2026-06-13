import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/landing/animated-section";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { LeadMagnetBox } from "@/components/lead-magnet-box";

export const metadata: Metadata = {
  title: "Blog para talleres mecánicos — Gestión, legal, marketing e ITV",
  description:
    "Guías prácticas para el mecánico que quiere profesionalizar su taller: órdenes de trabajo, RD 1457/1986, avisos ITV, Google Business y más. Sin humo.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

const categoriaLabels: Record<string, string> = {
  gestion: "Gestión",
  marketing: "Marketing",
  legal: "Legal",
  tecnologia: "Tecnología",
  consejos: "Consejos",
};

const categoriaColors: Record<string, string> = {
  gestion: "bg-blue-50 text-blue-700",
  marketing: "bg-violet-50 text-violet-700",
  legal: "bg-red-50 text-red-700",
  tecnologia: "bg-emerald-50 text-emerald-700",
  consejos: "bg-amber-50 text-amber-700",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts[0]; // El más reciente como destacado
  const rest = posts.slice(1);

  // Categorías únicas con conteo
  const categorias = [...new Set(posts.map((p) => p.category))];

  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}
    >
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-20">
        <AnimatedSection className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            Blog
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            El blog del taller que quiere crecer
          </h1>
          <p className="text-stone-500 mt-4 text-lg max-w-2xl">
            Guías prácticas, obligaciones legales y trucos de gestión.
            Sin humo, sin teoría — escrito desde un taller real.
          </p>
        </AnimatedSection>

        {/* Categorías */}
        <AnimatedSection delay={0.1} className="flex gap-2 flex-wrap mb-10">
          {categorias.map((cat) => (
            <span
              key={cat}
              className={`rounded-full px-3 py-1 text-xs font-bold ${categoriaColors[cat] || "bg-stone-100 text-stone-600"}`}
            >
              {categoriaLabels[cat] || cat}
            </span>
          ))}
        </AnimatedSection>

        {/* Post destacado */}
        {featured && (
          <AnimatedSection delay={0.15} className="mb-10">
            <Link href={`/blog/${featured.slug}`} className="block group">
              <article className="relative rounded-2xl bg-stone-950 text-white p-8 md:p-10 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-transparent to-blue-500/10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-sm text-stone-400 mb-4">
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">Último artículo</span>
                    <span>·</span>
                    <time dateTime={featured.date}>
                      {new Date(featured.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoriaColors[featured.category] || ""}`}
                    >
                      {categoriaLabels[featured.category] || featured.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight group-hover:text-orange-400 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-stone-400 mt-3 text-base leading-relaxed max-w-2xl">
                    {featured.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-orange-400 text-sm font-bold mt-6 group-hover:gap-2.5 transition-all">
                    Leer artículo <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </article>
            </Link>
          </AnimatedSection>
        )}

        {/* Grid de posts */}
        <StaggerContainer className="grid gap-5 md:grid-cols-2">
          {rest.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block group h-full">
                <article className="h-full rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </time>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${categoriaColors[post.category] || ""}`}
                    >
                      {categoriaLabels[post.category] || post.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-stone-500 mt-2 text-sm leading-relaxed flex-1">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold mt-4 group-hover:gap-2.5 transition-all">
                    Leer <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Lead magnet en el blog */}
        <div className="mt-12">
          <LeadMagnetBox />
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.2} className="mt-12 text-center">
          <p className="text-stone-500 text-sm mb-4">
            ¿Quieres ver cómo funciona en tu taller?
          </p>
          <Link href="/sign-up">
            <Button className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-12 px-8 shadow-lg shadow-orange-500/20 cursor-pointer">
              Probar FIXA 14 días gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
      <Footer />
    </div>
  );
}
