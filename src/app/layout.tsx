import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNSOBER BAR | Изысканная кухня и коктейли",
  description: "Уникальное место, где современная гастрономия встречается с традиционными рецептами",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`font-evolventa bg-[#0A0A0A] text-white antialiased`}>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
