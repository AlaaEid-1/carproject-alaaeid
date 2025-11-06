import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingChatButton from "../components/FloatingChatButton";
import { SessionProvider } from "../components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "CarExplorer - Discover Your Perfect Car",
//   description: "Explore a wide range of cars with reviews, ratings, and live chat support.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingChatButton />
        </SessionProvider>
      </body>
    </html>
  );
}
