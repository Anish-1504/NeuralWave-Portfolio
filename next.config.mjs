/** @type {import('next').NextConfig} */
const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/NeuralWave-Portfolio" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  ...(githubPages ? { basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
