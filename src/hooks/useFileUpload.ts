import { useState, useId } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useAtom } from 'jotai';
import { useSynapse } from '@/hooks/useSynapse';
import { useNetwork } from '@/hooks/useNetwork';
import { preflightCheck } from '@/utils/preflightCheck';
import { storageServiceAtom } from '@/store/synapse';

export type UploadedInfo = {
  fileName?: string;
  fileSize?: number;
  commp?: string;
  txHash?: string;
};

/**
 * Hook to upload a file to the Filecoin network using Synapse.
 */
export const useFileUpload = () => {
  const id = useId();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [uploadedInfo, setUploadedInfo] = useState<UploadedInfo | null>(null);

  const { address, chainId } = useAccount();
  const { data: network } = useNetwork();
  const { synapse, providerId } = useSynapse();
  const [storageService, setStorageService] = useAtom(storageServiceAtom);

  // A query to create the storage service instance once Synapse is ready.
  // This is separated from the upload mutation to prevent re-creating the service
  // for every upload, which is expensive and stateful.
  useQuery({
    queryKey: ['storage-service', !!synapse, providerId],
    queryFn: async () => {
      if (!synapse) {
        // The `enabled` option should prevent this from running, but as a safeguard:
        throw new Error('Synapse not ready for storage service creation.');
      }

      setStatus('🔗 Setting up storage service and proof set...');
      setProgress(25);

      const service = await synapse.createStorage({
        providerId: providerId ?? undefined,
        callbacks: {
          onProofSetResolved: (_info) => {
            setStatus('🔗 Existing proof set found and resolved');
            setProgress(30);
          },
          onProofSetCreationStarted: (_transactionResponse, _statusUrl) => {
            setStatus('🏗️ Creating new proof set on blockchain...');
            setProgress(35);
          },
          onProofSetCreationProgress: (status) => {
            console.log('Proof set creation progress:', status);
            if (status.transactionSuccess) {
              setStatus('⛓️ Proof set transaction confirmed on chain');
              setProgress(45);
            }
            if (status.serverConfirmed) {
              setStatus(
                `🎉 Proof set ready! (${Math.round(status.elapsedMs / 1000)}s)`,
              );
              setProgress(50);
            }
          },
          onProviderSelected: (_provider) => {
            setStatus('🏪 Storage provider selected');
          },
        },
      });

      setStorageService(service);
      return service;
    },
    enabled: !!synapse && !storageService,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    retry: false, // Avoid retrying on failure, as it's likely a setup issue.
  });

  const mutation = useMutation({
    mutationKey: ['file-upload', address, chainId, id],
    mutationFn: async (file: File) => {
      if (!synapse) throw new Error('Synapse instance not found');
      if (!storageService) throw new Error('Storage service not initialized');
      if (!network) throw new Error('Network not found');

      setProgress(0);
      setUploadedInfo(null);
      setStatus('🔄 Initializing file upload to Filecoin...');

      // 1) Convert File → ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      // 2) Convert ArrayBuffer → Uint8Array
      const uint8ArrayBytes = new Uint8Array(arrayBuffer);

      // 3) Check if we have a proofset
      const withProofset = !!providerId;

      // 4) Check if we have enough USDFC to cover the storage costs and deposit if not
      setStatus('💰 Checking USDFC balance and storage allowances...');
      setProgress(5);
      await preflightCheck(
        file,
        synapse,
        network,
        withProofset,
        setStatus,
        setProgress,
      );

      setStatus('📁 Uploading file to storage provider...');
      setProgress(55);
      // 5) Upload file to storage provider
      const { commp } = await storageService.upload(uint8ArrayBytes, {
        onUploadComplete: (_commp) => {
          setStatus(
            '📊 File uploaded! Signing msg to add roots to the proof set',
          );
          setProgress(80);
        },
        onRootAdded: async (transactionResponse) => {
          setStatus(
            `🔄 Waiting for transaction to be confirmed on chain${
              transactionResponse ? `(txHash: ${transactionResponse.hash})` : ''
            }`,
          );
          if (transactionResponse) {
            setUploadedInfo((prev) => ({
              ...prev,
              txHash: transactionResponse?.hash,
            }));
          }
          setProgress(85);
        },
        onRootConfirmed: (_rootIds) => {
          setStatus('🌳 Data roots added to proof set successfully');
          setProgress(90);
        },
      });

      // In case the transaction was not given back by the storage provider, we wait for 50 seconds
      // So we make sure that the transaction is confirmed on chain
      if (!uploadedInfo?.txHash) {
        console.warn('Transaction hash not found in uploaded info');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setProgress(95);
      setUploadedInfo((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size,
        commp: commp,
      }));
    },
    onSuccess: () => {
      setStatus('🎉 File successfully stored on Filecoin!');
      setProgress(100);
    },
    onError: (error: Error) => {
      console.error('Upload failed:', error);
      setStatus(`❌ Upload failed: ${error.message || 'Please try again'}`);
      setProgress(0);
    },
  });

  const handleReset = () => {
    setProgress(0);
    setUploadedInfo(null);
    setStatus('');
  };

  return {
    uploadFileMutation: mutation,
    progress,
    uploadedInfo,
    handleReset,
    status,
  };
};
