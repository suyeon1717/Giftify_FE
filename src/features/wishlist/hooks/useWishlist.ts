import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getMyWishlist, getWishlist } from '@/lib/api/wishlists';

import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Hook to fetch the current user's wishlist
 */
export function useMyWishlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.myWishlist,
    queryFn: getMyWishlist,
    enabled: !!user,
  });
}

/**
 * Hook to fetch a specific member's wishlist
 * @param memberId - The ID of the member whose wishlist to fetch
 */
export function useWishlist(memberId: string) {
  return useQuery({
    queryKey: queryKeys.wishlist(memberId),
    queryFn: () => getWishlist(memberId),
    enabled: !!memberId,
  });
}
