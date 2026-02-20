import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "GitHub Emoji picker",
  description:
    "A simple emotion picker that displays all the supported GitHub emojis.",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://github-emoji-picker.rickstaa.dev",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L37PEW2ENQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L37PEW2ENQ');
          `}
        </Script>
      </body>
    </html>
  );
}
