import "./globals.css";
import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "PUNA JOTE",
  description: "Connect job requests with trusted providers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
