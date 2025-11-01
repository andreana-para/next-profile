import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "My App",
  description: "A simple Next.js App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "12px 20px", borderBottom: "1px solid #ddd", marginBottom: "20px" }}>
          <nav>
            <Link href="/" style={{ marginRight: "16px" }}>Home</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
