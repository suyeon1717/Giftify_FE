import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  toggleCartItemSelection,
} from '@/lib/api/cart';
import type { CartItemCreateRequest, CartItemUpdateRequest, Cart } from '@/types/cart';

/**
 * Hook to add an item to the cart
 *
 * @note 백엔드 V2 API는 POST /api/v2/carts/{cartId} 형식이므로
 *       먼저 장바구니를 조회하여 cartId를 획득한 후 아이템을 추가합니다.
 *
 * Invalidates: cart, funding(id)
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CartItemCreateRequest) => {
      // 1. 캐시에서 cart 조회 또는 API 호출
      let cart = queryClient.getQueryData<Cart>(queryKeys.cart);
      if (!cart) {
        cart = await getCart();
      }

      // 2. cartId로 아이템 추가
      await addCartItem(cart.id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      // Also invalidate the specific funding
      if (variables.fundingId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.funding(variables.fundingId) });
      }
    },
  });
}

/**
 * Hook to update a cart item (amount)
 *
 * Invalidates: cart
 *
 * Includes optimistic update for better UX
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: CartItemUpdateRequest }) =>
      updateCartItem(itemId, data),
    onMutate: async ({ itemId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(queryKeys.cart);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.cart, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item: any) =>
            item.id === itemId ? { ...item, ...data } : item
          ),
        };
      });

      // Return a context with the previous value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

/**
 * Hook to remove an item from the cart
 *
 * Invalidates: cart
 *
 * Includes optimistic update for better UX
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onMutate: async (itemId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(queryKeys.cart);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.cart, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item: any) => item.id !== itemId),
        };
      });

      // Return a context with the previous value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

/**
 * Hook to toggle cart item selection (checkbox)
 *
 * Invalidates: cart
 *
 * Includes optimistic update for better UX
 */
export function useToggleCartSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, selected }: { itemId: string; selected: boolean }) =>
      toggleCartItemSelection(itemId, selected),
    onMutate: async ({ itemId, selected }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(queryKeys.cart);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.cart, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item: any) =>
            item.id === itemId ? { ...item, selected } : item
          ),
        };
      });

      // Return a context with the previous value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}
