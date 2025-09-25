import { memo } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { components } from '@/lib/tokens';
import { cn } from '@/lib/utils';

// Optimized feature item - memoized to prevent re-renders
export const FeatureItem = memo(({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <CheckIcon className={components.checkIcon} />
    <span className="text-gray-700 leading-relaxed">{children}</span>
  </li>
));

// Optimized feature list
export const FeatureList = memo(({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <FeatureItem key={i}>{item}</FeatureItem>
    ))}
  </ul>
));

// Optimized card variants
const cardVariants = {
  default: components.card,
  highlighted: components.cardHighlighted,
  bordered: components.cardBordered,
} as const;

interface CardProps {
  title: string;
  items?: string[];
  children?: React.ReactNode;
  variant?: keyof typeof cardVariants;
  className?: string;
}

// Optimized card component
export const Card = memo(({ title, items, children, variant = 'default', className }: CardProps) => (
  <div className={cn('rounded-lg p-6', cardVariants[variant], className)}>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    {items && <FeatureList items={items} />}
    {children}
  </div>
));

// Optimized grid component
const gridVariants = {
  1: 'grid-cols-1',
  2: components.grid2,
  3: components.grid3,
} as const;

export const Grid = memo(({ 
  children, 
  columns = 2, 
  className 
}: { 
  children: React.ReactNode; 
  columns?: keyof typeof gridVariants;
  className?: string;
}) => (
  <div className={cn(gridVariants[columns], className)}>
    {children}
  </div>
));

// Optimized section component
export const Section = memo(({ 
  title, 
  icon, 
  description, 
  children,
  className
}: {
  title: string;
  icon?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn(components.section, className)}>
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        {icon && <span className="text-4xl" role="img" aria-label="icon">{icon}</span>}
        {title}
      </h2>
      {description && (
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">{description}</p>
      )}
    </div>
    {children}
  </section>
));

// Optimized page header
export const PageHeader = memo(({ 
  title, 
  description 
}: { 
  title: string; 
  description: string; 
}) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-700">
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
        <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
));

// Optimized button variants
const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
} as const;

const buttonVariants = {
  primary: components.buttonPrimary,
  secondary: components.buttonSecondary,
} as const;

export const Button = memo(({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  onClick
}: {
  children: React.ReactNode;
  href?: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
  onClick?: () => void;
}) => {
  const classes = cn(
    components.button,
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
});