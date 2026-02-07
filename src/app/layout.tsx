import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CRUD · 프롬프트 관리",
  description: "프롬프트를 저장하고 관리합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
