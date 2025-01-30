import '../styles/globals.css'; // Import Tailwind CSS global styles
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
