import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 神盾盃國際邀請賽暨國防 AI 競賽",
  description:
    "2026 神盾盃國際邀請賽暨國防 AI 競賽官方活動網站：競賽資訊、重要日期、獎項獎金與報名入口。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
