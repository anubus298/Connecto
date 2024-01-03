import { Space_Grotesk } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Connecto",
  description: "Your Free Social App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body>
        <main className="grid min-h-screen grid-cols-12 gap-1 ">
          {children}
        </main>
      </body>
    </html>
  );
}
