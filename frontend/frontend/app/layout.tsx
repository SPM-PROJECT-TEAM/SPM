import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduAI | Syllabus command center",
  description: "The next-generation AI teacher portal",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
