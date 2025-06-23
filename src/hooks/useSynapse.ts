import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { Synapse } from '@filoz/synapse-sdk';
import { useEthersSigner } from '@/hooks/useEthers';
import { useAccount } from 'wagmi';
import { useNetwork } from '@/hooks/useNetwork';
import { getProofset } from '@/utils/getProofset';
import { config } from '@/synapseConfig';
import { synapseAtom, providerIdAtom } from '@/store/synapse';

/**
 * Hook to initialize and provide a shared Synapse instance and provider ID.
 * This hook ensures that `Synapse.create` is only called once and the result is shared
 * across all components, preventing re-initializations on re-renders.
 * It uses React Query to manage the asynchronous initialization and caching.
 */
export const useSynapse = () => {
  const [synapse, setSynapse] = useAtom(synapseAtom);
  const [providerId, setProviderId] = useAtom(providerIdAtom);

  const signer = useEthersSigner();
  const { address } = useAccount();
  const { data: network } = useNetwork();

  // A query to create the main Synapse instance.
  // This is cached indefinitely to ensure it's only created once per session.
  const { isLoading: isSynapseLoading, isError: isSynapseError } = useQuery({
    queryKey: ['synapse-instance', !!signer],
    queryFn: async () => {
      if (!signer) {
        throw new Error('Signer not available for Synapse initialization.');
      }
      const instance = await Synapse.create({
        provider: signer.provider,
        disableNonceManager: false,
        withCDN: config.withCDN,
      });
      setSynapse(instance);
      return instance;
    },
    enabled: !!signer && !synapse, // Only run if signer is ready and instance doesn't exist
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    retry: false, // If it fails once, it will likely fail again until dependencies change
  });

  // A query to get the provider ID from the user's proofset.
  const { isLoading: isProviderIdLoading, isError: isProviderIdError } =
    useQuery({
      queryKey: ['proofset', address, network],
      queryFn: async () => {
        if (!signer || !network || !address) {
          throw new Error(
            'Cannot get proofset without signer, network, or address.',
          );
        }
        const { providerId } = await getProofset(signer, network, address);
        // The providerId from getProofset is a number, but we need to store it as a string
        setProviderId(providerId);
        return providerId;
      },
      // Only run if we have the necessary info and providerId hasn't been fetched yet.
      // The `synapse` dependency ensures we wait for the main instance first.
      enabled:
        !!signer && !!network && !!address && !!synapse && providerId === null,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    });

  return {
    synapse,
    providerId,
    isLoading: isSynapseLoading || isProviderIdLoading,
    isError: isSynapseError || isProviderIdError,
  };
};
