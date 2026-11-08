import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Studio | Interactive Property Showcase",
  description: "Explore and customise an interactive 3D property."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
