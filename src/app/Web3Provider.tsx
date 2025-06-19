'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { filecoin, filecoinCalibration } from 'wagmi/chains';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { env } from './env';
import type { ReactNode } from 'react';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [filecoin, filecoinCalibration],
    transports: {
      [filecoin.id]: http(),
      [filecoinCalibration.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: env.NEXT_PUBLIC_PROJECT_ID,

    // Required App Info
    appName: 'filtube',

    // Optional App Info
    appDescription: 'People Powered Tube',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

export const Web3Provider = ({ children }: Props) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
