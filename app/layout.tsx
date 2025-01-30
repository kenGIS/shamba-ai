import '../styles/globals.css'; // Import Tailwind CSS global styles
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        {children}
        {/* Vercel Analytics Tracking Script */}
        <Script strategy="lazyOnload" src="https://vercel.com/analytics/script.js" />
      </body>
    </html>
  );
}
