import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Web3Provider } from './Web3Provider';
import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/provider';

export const metadata: Metadata = {
  title: 'FilTube',
  description: 'People Powered Tube',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Web3Provider>
              {children}
              <Toaster />
            </Web3Provider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
