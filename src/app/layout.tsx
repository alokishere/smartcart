import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/initUser";

export const metadata: Metadata = {
  title: "SmartCart | 15 minute grocery delivery at your doorstep",
  description:
    "SmartCart is a next-generation grocery delivery service that promises to deliver your groceries within 15 minutes. With a wide range of products and a user-friendly app, SmartCart is revolutionizing the way you shop for groceries. Experience the convenience of fast and reliable grocery delivery with SmartCart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-linear-to-b from-green-100 to-white">
      <SessionProvider>
        <StoreProvider>
          <InitUser/>
        {children}
        </StoreProvider>
      </SessionProvider>
      </body>
    </html>
  );
}
