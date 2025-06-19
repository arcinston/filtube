import { CONTRACT_ADDRESSES, PandoraService } from '@filoz/synapse-sdk';
import type { JsonRpcSigner } from 'ethers';
import { config } from '@/synapseConfig';

// Pick the provider that has the most used storage
// in a proofset with the client
export const getProofset = async (
  signer: JsonRpcSigner,
  network: 'mainnet' | 'calibration',
  address: string,
) => {
  const pandoraService = new PandoraService(
    signer.provider,
    CONTRACT_ADDRESSES.PANDORA_SERVICE[network],
  );
  const AllproofSets =
    await pandoraService.getClientProofSetsWithDetails(address);

  const proofSetsWithCDN = AllproofSets.filter((proofSet) => proofSet.withCDN);

  const proofSetsWithoutCDN = AllproofSets.filter(
    (proofSet) => !proofSet.withCDN,
  );

  const proofSets = config.withCDN ? proofSetsWithCDN : proofSetsWithoutCDN;

  const bestProofset = proofSets.reduce((max, proofSet) => {
    return proofSet.currentRootCount > max.currentRootCount ? proofSet : max;
  }, proofSets[0]);

  const providerId = await pandoraService.getProviderIdByAddress(
    bestProofset.payee,
  );

  return { providerId, proofset: bestProofset };
};
