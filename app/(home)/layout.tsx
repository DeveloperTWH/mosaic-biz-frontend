import type { Metadata, Viewport } from "next";
import "../globals.css";
import AnnouncementBar from "./Components/AnnouncementBar";
import Navbar from "./Components/Navbar";
import MobileBottomNav from "./Components/nav/MobileBottomNav";
import Footer from "./Components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/pagination";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mosaicbizhub.com"),
  icons: {
    icon: "/mosaic-brand-logo.png",
    apple: "/mosaic-brand-logo.png",
  },
  title: {
    default: "Mosaic Biz Hub — Where Culture and Commerce Connect",
    template: "%s | Mosaic Biz Hub",
  },
  description:
    "Discover and support trusted minority-owned businesses. Shop products, book services, and explore food from verified vendors on Mosaic Biz Hub.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mosaic Biz Hub",
    title: "Mosaic Biz Hub — Where Culture and Commerce Connect",
    description:
      "Discover and support trusted minority-owned businesses on a mobile-first marketplace built for community commerce.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mosaic Biz Hub",
    description: "Discover trusted minority-owned businesses.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="with-fixed-header">
      <body className={`${fontVariables} market-page antialiased min-h-screen w-full overflow-x-hidden`}>
        <AnnouncementBar />
        <Navbar />
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
