import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
// import Header from "@widgets/Header";
// import Footer from "@widgets/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeyRush",
  description: "Always There for You",
};
const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth", "slnt", "opsz"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoFlex.variable} antialiased`}>
        {/* <Navbar /> */}

        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
