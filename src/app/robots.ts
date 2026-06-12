import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/sign-in",
          "/sign-up",
          // App privada (tras login)
          "/ordenes",
          "/clientes",
          "/presupuestos",
          "/calendario",
          "/facturacion",
          "/configuracion",
          "/equipo",
          "/avisos",
          "/documentos",
          "/taller-board",
          "/notificaciones",
          // Páginas de cliente final con token (privadas, no indexables)
          "/presupuesto/",
          "/estado/",
          "/informe/",
          "/documento/",
          "/aprobar/",
          "/cita/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
