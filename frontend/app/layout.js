import RainbowKitAndWagmiProvider from "./RainbowKitAndWagmiProvider";
import Layout from "@/components/shared/Layout";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Voting App TP3",
  description: "Voting application for Alyra TP3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <RainbowKitAndWagmiProvider>
          <Layout>{children}</Layout>
        </RainbowKitAndWagmiProvider>
      </body>
    </html>
  );
}
