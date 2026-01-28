'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface ProductSearchHeaderProps {
  onSearchChange?: (query: string) => void;
}

/**
 * ProductSearchHeader - Search input with debouncing
 * Updates URL params on search
 */
export function ProductSearchHeader({ onSearchChange }: ProductSearchHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set('q', query);
        } else {
          params.delete('q');
        }
        params.delete('page'); // Reset page on new search

        router.push(`/products?${params.toString()}`);
        onSearchChange?.(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, initialQuery, searchParams, router, onSearchChange]);

  const handleClear = () => {
    setQuery('');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b sticky top-0 z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="shrink-0"
      >
        ←
      </Button>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품명 검색..."
          className="pl-9 pr-9"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="shrink-0"
      >
        취소
      </Button>
    </div>
  );
}
