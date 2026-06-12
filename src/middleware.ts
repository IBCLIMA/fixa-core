import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/inicio",
  // SEO/PWA: imprescindible que sean públicos para crawlers
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json",
  "/opengraph-image(.*)",
  "/twitter-image(.*)",
  "/blog(.*)",
  "/funciones(.*)",
  "/precios(.*)",
  "/nosotros",
  "/web-para-talleres",
  "/taller(.*)",
  "/vs(.*)",
  "/precios",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/estado(.*)",
  "/cita(.*)",
  "/informe(.*)",
  "/presupuesto(.*)",
  "/documento(.*)",
  "/aprobar(.*)",
  "/privacidad",
  "/terminos",
  "/aviso-legal",
  "/cookies",
  "/dpa",
  "/api/health",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // SEO: /inicio se consolida en la raíz (308 permanente)
  if (pathname === "/inicio") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }

  // La raíz sirve la landing a anónimos (rewrite interno, la URL sigue siendo "/")
  // y el panel del taller a usuarios autenticados.
  if (pathname === "/") {
    const { userId } = await auth();
    if (!userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/inicio";
      return NextResponse.rewrite(url);
    }
  }

  // Persist invite token from sign-up URL into a cookie for later use
  if (req.nextUrl.pathname.startsWith("/sign-up")) {
    const inviteToken = req.nextUrl.searchParams.get("invite");
    if (inviteToken) {
      const response = NextResponse.next();
      response.cookies.set("invite_token", inviteToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });
      return response;
    }
  }

  if (isPublicRoute(req)) return;

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-up", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|webm|mp4|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
