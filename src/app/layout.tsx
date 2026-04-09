import type { Metadata } from "next";
// import Header from "@widgets/Header";
// import Footer from "@widgets/Footer";
// import "../shared/styles/globals.css";

export const metadata: Metadata = {
  title: "KeyRush",
  description: "Always There for You",
};

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="no-scrollbar max-w-1440 mx-auto">
        {/* <Header /> */}
        <main className="min-h-screen">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
