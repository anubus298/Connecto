import { Space_Grotesk } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@fortawesome/fontawesome-svg-core/styles.css";
interface Props {
  children: React.ReactNode;
}
config.autoAddCss = false;
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--spaceGrotesk",
});
import "./globals.css";
import ConfigProvider from "antd/es/config-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Connecto",
  description: "Your Free Social App",
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={spaceGrotesk.className + " " + spaceGrotesk.variable}
    >
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: "var(--spaceGrotesk)",
                colorPrimary: "#ac47f5",
                colorInfo: "#ac47f5",
                borderRadius: 5,
                wireframe: true,

                colorTextBase: "#1d1d1b",
                colorWarning: "#faad14",
              },
              components: {
                Menu: {
                  itemBg: "#ffffff",
                },
              },
            }}
          >
            <main className="grid min-h-[80dvh] grid-cols-12 gap-1 bg-gray-100">
              {children}
            </main>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
