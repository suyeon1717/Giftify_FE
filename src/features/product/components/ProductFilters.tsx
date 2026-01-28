'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

/**
 * ProductFilters - Filter sheet for category and price range
 * Updates URL params on apply
 */
export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }

    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }

    params.delete('page'); // Reset page on filter change

    router.push(`/products?${params.toString()}`);
    setOpen(false);
  };

  const handleReset = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');

    router.push(`/products?${params.toString()}`);
    setOpen(false);
  };

  const hasActiveFilters = category || minPrice || maxPrice;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          필터
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>필터</SheetTitle>
          <SheetDescription>
            카테고리와 가격 범위로 상품을 필터링하세요
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 border rounded-md"
            >
              <option value="">전체</option>
              <option value="electronics">전자제품</option>
              <option value="fashion">패션</option>
              <option value="beauty">뷰티</option>
              <option value="home">홈/리빙</option>
              <option value="sports">스포츠</option>
              <option value="books">도서</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <Label>가격 범위</Label>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="minPrice" className="text-sm text-gray-600">
                  최소 가격
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="maxPrice" className="text-sm text-gray-600">
                  최대 가격
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="1000000"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            초기화
          </Button>
          <Button onClick={handleApply} className="flex-1">
            적용
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
