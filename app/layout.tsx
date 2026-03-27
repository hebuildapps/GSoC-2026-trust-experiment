import "./globals.css";

export const metadata = {
  title: "AI Recommendation Module",
  description: "A light-weight conditional A/B trust experiment - recommendation of product",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
