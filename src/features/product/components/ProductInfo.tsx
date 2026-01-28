'use client';

import { Star, Package, TruckIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ProductDetail } from '@/types/product';

export interface ProductInfoProps {
  product: ProductDetail;
}

/**
 * ProductInfo - Display product details including name, price, description
 */
export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Title and Price */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold leading-8">{product.name}</h1>
        {product.category && (
          <p className="text-sm text-gray-600">{product.category}</p>
        )}
        <p className="text-3xl font-bold tabular-nums">
          ₩{product.price.toLocaleString()}
        </p>
      </div>

      {/* Rating and Stats */}
      {(product.rating || product.reviewCount || product.salesCount) && (
        <>
          <Separator />
          <div className="flex items-center gap-4 text-sm">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                {product.reviewCount && (
                  <span className="text-gray-500">({product.reviewCount.toLocaleString()}개 리뷰)</span>
                )}
              </div>
            )}
            {product.salesCount && (
              <div className="text-gray-600">
                판매 {product.salesCount.toLocaleString()}개
              </div>
            )}
          </div>
        </>
      )}

      {/* Delivery Info */}
      <Separator />
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Package className="h-4 w-4" />
          배송 정보
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <TruckIcon className="h-4 w-4 text-gray-400" />
            <span>무료배송 · 내일 도착 예정</span>
          </div>
          {product.stock !== undefined && (
            <p className="text-gray-600">
              재고: {product.stock > 0 ? `${product.stock}개` : '품절'}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-semibold">상품 설명</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
