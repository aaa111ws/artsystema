import type { NextConfig } from "next";

// Сайт может жить в подпапке (например /artsystema/) — путь задаётся при сборке.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Кружок Next.js в левом нижнем углу — только для разработки, он мешает.
  devIndicators: false,
  output: "standalone",
  basePath,
  // Обычные <img src="/..."> basePath не получают, поэтому пробрасываем его в код.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  experimental: {
    // Без этого барель lucide-react тянет ~1000 модулей в dev.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
