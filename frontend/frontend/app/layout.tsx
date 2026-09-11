import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduAI | Syllabus command center",
  description: "The next-generation AI teacher portal",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
