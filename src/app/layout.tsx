// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DataProvider } from '../contexts/DataContext'; // Import your DataProvider
import Navbar from '../components/Navbar'; // Assuming you have a Navbar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Waste Swaraj',
  description: 'Efficient waste management for a cleaner India',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataProvider> {/* Wrap your app with DataProvider */}
          <Navbar />
          {children}
        </DataProvider>
      </body>
    </html>
  );
}