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
import {
  DEFAULT_SHARE_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  getMetadataBase,
} from "@/lib/seo/metadata";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  icons: {
    icon: "/mosaic-brand-logo.png",
    apple: "/mosaic-brand-logo.png",
  },
  title: {
    default: "Mosaic Biz Hub — Where Culture and Commerce Connect",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Mosaic Biz Hub — Where Culture and Commerce Connect",
    description:
      DEFAULT_SITE_DESCRIPTION,
    url: "/",
    images: [{ url: DEFAULT_SHARE_IMAGE, alt: `${SITE_NAME} marketplace preview` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [DEFAULT_SHARE_IMAGE],
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
