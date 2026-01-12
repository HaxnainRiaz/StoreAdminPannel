import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider, ProtectedRoute } from "@/context/AuthContext";
import SidebarWrapper from "@/components/admin/SidebarWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Luminelle | Admin Panel",
  description: "Administrative dashboard for Luminelle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AdminProvider>
            <ProtectedRoute>
              <SidebarWrapper>
                {children}
              </SidebarWrapper>
            </ProtectedRoute>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
