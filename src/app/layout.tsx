import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { EnhancedAuthProvider } from "@/components/EnhancedAuthProvider";
import { SessionChecker } from "@/components/SessionChecker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "个人导航页",
  description: "一个现代化的个人导航页面",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EnhancedAuthProvider>
            <SessionChecker>
              {children}
            </SessionChecker>
          </EnhancedAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}