import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Rest Bar | Изысканная кухня и коктейли",
  description: "Уникальное место, где современная гастрономия встречается с традиционными рецептами",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#0A0A0A] text-white antialiased`}>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
