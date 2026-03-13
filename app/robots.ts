import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planwiki.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/chat", "/onboarding", "/_next/static/", "/features/"],
        disallow: [
          "/api/",
          "/server/",
          "/private/",
          "/admin/",
          "/*?tool=*",
          "/*?ref=*",
          "/*?utm_*",
          "/*?*=*&*=*",
        ],
      },
      // Googlebot-specific rules
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/api/",
      },
      // Bingbot-specific rules
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
