// src/app/layout.tsx
import './globals.css'; // Your global styles should be imported here
import Navbar from '../components/layout/Navbar'; // Correct path to your Navbar component
import { DataProvider } from '../contexts/DataContext'; // Ensure DataProvider wraps components that use DataContext

export const metadata = {
  title: 'Smart Waste Swaraj',
  description: 'Revolutionizing Waste Management for a Cleaner India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap components that use DataContext with DataProvider */}
        <DataProvider>
          {/* Navbar should be rendered here to appear on all pages */}
          <Navbar />
          {/* All page content (including src/app/page.tsx) will be rendered inside <main> */}
          <main>{children}</main>
          {/* You might also have a Footer component here if applicable */}
        </DataProvider>
      </body>
    </html>
  );
}