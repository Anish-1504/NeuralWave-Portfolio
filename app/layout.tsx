import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuralWaves | Halo Studio & Pulse One",
  description:
    "Explore NeuralWaves Halo Studio headphones and Pulse One smartwatch through cinematic product stories, interactive features, and detailed specifications.",
  keywords: [
    "NeuralWaves Halo Studio",
    "NeuralWaves Pulse One",
    "3D Product Showcase",
    "Active Noise Cancellation",
    "Interactive Canvas",
    "Technology Design",
  ],
  authors: [{ name: "NeuralWaves Studio" }],
  openGraph: {
    title: "NeuralWaves | Halo Studio & Pulse One",
    description:
      "Explore the engineering, innovation, and acoustic physics behind two iconic technology categories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-white selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
