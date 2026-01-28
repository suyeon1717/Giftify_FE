'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddWishlistItem } from '@/features/product/hooks/useAddWishlistItem';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

export interface AddToWishlistButtonProps {
  productId: string;
  productName: string;
  variant?: 'default' | 'icon';
  className?: string;
}

/**
 * AddToWishlistButton - Button to add product to user's wishlist
 * Shows success/error feedback via toast
 */
export function AddToWishlistButton({
  productId,
  productName,
  variant = 'default',
  className,
}: AddToWishlistButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addToWishlist = useAddWishlistItem();

  const handleAdd = async () => {
    try {
      await addToWishlist.mutateAsync({ productId });
      setIsAdded(true);
      toast.success('위시리스트에 추가되었습니다', {
        description: productName,
      });
    } catch (error: any) {
      console.error('Failed to add to wishlist:', error);

      // Handle specific error cases
      if (error.code === 'WISHLIST_001') {
        toast.error('이미 위시리스트에 있는 상품입니다');
      } else if (error.status === 401) {
        toast.error('로그인이 필요합니다');
      } else {
        toast.error('위시리스트 추가에 실패했습니다', {
          description: error.message || '다시 시도해주세요',
        });
      }
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleAdd}
        disabled={addToWishlist.isPending || isAdded}
        className={cn(
          'transition-colors',
          isAdded && 'bg-pink-50 border-pink-300',
          className
        )}
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-all',
            isAdded && 'fill-pink-500 text-pink-500'
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleAdd}
      disabled={addToWishlist.isPending || isAdded}
      className={cn(
        'gap-2 transition-colors',
        isAdded && 'bg-pink-50 border-pink-300 text-pink-700',
        className
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all',
          isAdded && 'fill-pink-500 text-pink-500'
        )}
      />
      {isAdded ? '위시리스트에 추가됨' : '위시리스트에 추가'}
    </Button>
  );
}
