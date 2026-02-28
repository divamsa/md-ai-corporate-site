import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "マネーデザイン | 生成AI導入支援",
  description: "マネーデザインは企業の生成AI導入を総合的に支援します。戦略立案からPoC開発、本番運用まで、一気通貫でサポートします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
