import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchOwnedAssets } from '@/lib/api-client';

export function useOwnedAssets() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['owned-assets', address],
    queryFn: () => fetchOwnedAssets(address!),
    enabled: !!address,
  });
}
