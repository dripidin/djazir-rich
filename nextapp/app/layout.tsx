import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DJAZAIR RICH — طاولة سلطان دارو | صناعة جزائرية فاخرة",
  description: "طاولة صالون فاخرة مصنوعة يدوياً في الجزائر، بواجهة زجاجية أنيقة وإضاءة RGB ذكية تُحكم من هاتفك. اطلب الآن بالدفع عند الاستلام.",
  openGraph: {
    title: "DJAZAIR RICH — طاولة سلطان دارو | صناعة جزائرية فاخرة",
    description: "طاولة صالون فاخرة مصنوعة في الجزائر بأيدي حرفيين محليين مع إضاءة RGB ذكية. التوصيل لكل ولايات الجزائر.",
    type: "website",
    images: [
      {
        url: "/image/logo Dark Brown.webp",
      }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
