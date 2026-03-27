import "./globals.css";

export const metadata = {
  title: "AI Recommendation Module",
  description: "A minimal A/B trust experiment",
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
