import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PP Namias — Portfolio V2",
  description: "Next-generation portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
