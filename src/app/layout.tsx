import type { Metadata } from "next";
import '../globals.css'
import 'highlight.js/styles/atom-one-dark.css';

export const metadata: Metadata = {
  title: "ChatGPT",
  description: 'A conversational AI system that listens, learns, and challenges'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.82af6fe1.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://cdn.oaistatic.com/_next/static/media/favicon-16x16.a052137e.png" />
      </head>

      <body>{children}</body>
      <script src="/jsencrypt.min.js" async  ></script>
    </html>
  );
}
