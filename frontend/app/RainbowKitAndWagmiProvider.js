'use client'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { sepolia } from '@/utils/sepolia';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig(
  {
    appName: 'Mobility DApp',
    projectId: 'prj_poMvVkouz21EPLwjEzEHb0LKjoho',
    chains: [hardhat, sepolia],
    ssr: true,
});

const queryClient = new QueryClient();

const RainbowKitAndWagmiProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitAndWagmiProvider