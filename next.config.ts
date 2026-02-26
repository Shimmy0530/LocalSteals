import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disable Serwist in dev because @serwist/next uses webpack and
  // Next.js 16 defaults to Turbopack for `next dev`.
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig = {
  serverExternalPackages: ["firebase-admin"],
};

export default withSerwist(nextConfig);
