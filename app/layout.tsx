"use client" // Client component directive

import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react"
import { getCookie } from "@/utils/cookies"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const csrftoken = getCookie('csrftoken');
        if (!csrftoken) {
          throw new Error("CSRF token not found");
        }

        const response = await fetch("http://127.0.0.1:8000/user/refresh-token/", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        console.log("Token refreshed successfully");
      } catch (err) {
        console.error("Error refreshing token:", err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    // Initial refresh
    refreshAccessToken();

    // Set up interval
    const intervalId = setInterval(refreshAccessToken, 8 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}