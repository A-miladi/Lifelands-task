import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "کاوش بازی‌ها | Lifelands",
  description: "بازی بعدی موردعلاقه‌ات را پیدا کن",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body
        suppressHydrationWarning
        className="bg-app min-h-dvh text-gray-900 font-iransans"
      >
        {children}
      </body>
    </html>
  );
}
