import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton = memo(({ 
  className, 
  width = 'w-full', 
  height = 'h-4' 
}: SkeletonProps) => (
  <div 
    className={cn(
      'animate-pulse bg-gray-200 rounded', 
      width, 
      height,
      className
    )} 
  />
));

export const SkeletonCard = memo(({ className }: { className?: string }) => (
  <div className={cn('bg-white rounded-lg shadow-md p-6', className)}>
    <Skeleton height="h-6" className="mb-4" width="w-3/4" />
    <Skeleton height="h-4" className="mb-2" />
    <Skeleton height="h-4" className="mb-2" width="w-5/6" />
    <Skeleton height="h-4" width="w-2/3" />
  </div>
));

export const SkeletonTable = memo(() => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="px-6 py-4 border-b">
      <Skeleton height="h-6" width="w-1/3" />
    </div>
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <Skeleton height="h-10" width="w-10" className="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-1/2" />
          <Skeleton height="h-3" width="w-1/3" />
        </div>
        <Skeleton height="h-8" width="w-20" />
      </div>
    ))}
  </div>
));

export const SkeletonChart = memo(() => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <Skeleton height="h-6" width="w-1/3" className="mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-end gap-2 h-32">
          {Array.from({ length: 7 }, (_, j) => (
            <Skeleton 
              key={j} 
              width="w-8" 
              height={`h-${Math.floor(Math.random() * 24) + 8}`}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  </div>
));