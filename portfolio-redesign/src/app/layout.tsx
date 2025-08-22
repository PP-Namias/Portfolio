import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals-minimalist.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PP Namias - Full-Stack Software Engineer",
  description: "Professional portfolio of PP Namias, a skilled full-stack software engineer specializing in modern web technologies and innovative solutions.",
  keywords: ["PP Namias", "Full-Stack Developer", "Software Engineer", "Web Developer", "React", "Node.js", "TypeScript"],
  authors: [{ name: "PP Namias" }],
  creator: "PP Namias",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ppnamias.dev",
    title: "PP Namias - Full-Stack Software Engineer",
    description: "Professional portfolio showcasing modern web development expertise and innovative project solutions.",
    siteName: "PP Namias Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "PP Namias - Full-Stack Software Engineer",
    description: "Professional portfolio showcasing modern web development expertise and innovative project solutions.",
    creator: "@ppnamias",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${inter.className} antialiased bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
