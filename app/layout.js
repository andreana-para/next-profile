import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import NavBar from "@/components/NavBar"

export const metadata = {
  title: "My App",
  description: "A simple Next.js App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "12px 20px", borderBottom: "1px solid #ddd", marginBottom: "20px" }}>
          <SessionProvider>
            <NavBar />
          </SessionProvider>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
