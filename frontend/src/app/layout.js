import { Providers } from "@/redux/Providers";
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

