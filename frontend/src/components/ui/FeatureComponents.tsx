import React from 'react';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/solid';

interface FeatureItemProps {
  children: React.ReactNode;
  icon?: 'check' | 'check-circle';
  className?: string;
}

export const FeatureItem = ({ 
  children, 
  icon = 'check',
  className = ""
}: FeatureItemProps) => {
  const IconComponent = icon === 'check-circle' ? CheckCircleIcon : CheckIcon;
  
  return (
    <li className={`flex items-start gap-3 ${className}`}>
      <IconComponent className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
      <span className="text-gray-700 leading-relaxed">{children}</span>
    </li>
  );
};

interface FeatureListProps {
  items: React.ReactNode[];
  icon?: 'check' | 'check-circle';
  className?: string;
}

export const FeatureList = ({ 
  items, 
  icon = 'check',
  className = ""
}: FeatureListProps) => (
  <ul className={`space-y-3 ${className}`}>
    {items.map((item, index) => (
      <FeatureItem key={index} icon={icon}>
        {item}
      </FeatureItem>
    ))}
  </ul>
);

interface FeatureCardProps {
  title: string;
  description?: string;
  items?: React.ReactNode[];
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted' | 'bordered';
}

export const FeatureCard = ({
  title,
  description,
  items,
  children,
  icon,
  className = "",
  variant = 'default'
}: FeatureCardProps) => {
  const baseClasses = "rounded-lg p-6";
  const variantClasses = {
    default: "bg-white shadow-md border border-gray-100",
    highlighted: "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg",
    bordered: "bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      {description && (
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      )}
      
      {items && <FeatureList items={items} />}
      {children && <div className="space-y-4">{children}</div>}
    </div>
  );
};

interface FeatureSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export const FeatureSection = ({
  title,
  description,
  icon,
  children,
  className = "",
  headerClassName = ""
}: FeatureSectionProps) => (
  <section className={`mb-16 ${className}`}>
    <div className={`mb-8 ${headerClassName}`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        {icon && <span className="text-4xl" role="img" aria-label="section icon">{icon}</span>}
        {title}
      </h2>
      {description && (
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">{description}</p>
      )}
    </div>
    {children}
  </section>
);

interface FeatureGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const FeatureGrid = ({ 
  children, 
  columns = 2,
  className = ""
}: FeatureGridProps) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-8 ${className}`}>
      {children}
    </div>
  );
};

interface FeatureStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const FeatureStat = ({
  label,
  value,
  icon,
  description,
  className = ""
}: FeatureStatProps) => (
  <div className={`text-center p-6 ${className}`}>
    {icon && (
      <div className="flex justify-center mb-3">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          {icon}
        </div>
      </div>
    )}
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-lg font-medium text-gray-700 mb-2">{label}</div>
    {description && (
      <div className="text-sm text-gray-500">{description}</div>
    )}
  </div>
);

interface FeatureHighlightProps {
  title: string;
  description: string;
  features: string[];
  image?: string;
  imageAlt?: string;
  reversed?: boolean;
  className?: string;
}

export const FeatureHighlight = ({
  title,
  description,
  features,
  image,
  imageAlt,
  reversed = false,
  className = ""
}: FeatureHighlightProps) => (
  <div className={`grid md:grid-cols-2 gap-12 items-center ${className}`}>
    <div className={`space-y-6 ${reversed ? 'md:order-2' : ''}`}>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      </div>
      <FeatureList items={features} />
    </div>
    
    {image && (
      <div className={`${reversed ? 'md:order-1' : ''}`}>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <img 
            src={image} 
            alt={imageAlt || title}
            className="mx-auto max-w-full h-auto"
          />
        </div>
      </div>
    )}
    
    {!image && (
      <div className={`${reversed ? 'md:order-1' : ''}`}>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 text-center">
          <div className="text-6xl text-gray-300 mb-4">📊</div>
          <p className="text-gray-500">Feature visualization</p>
        </div>
      </div>
    )}
  </div>
);

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  breadcrumb,
  className = ""
}: PageHeaderProps) => (
  <div className={`bg-gradient-to-r from-indigo-600 to-purple-700 ${className}`}>
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      {breadcrumb && (
        <div className="mb-6 text-indigo-100">
          {breadcrumb}
        </div>
      )}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {title}
        </h1>
        <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CTAButton = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = ""
}: CTAButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <a 
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </a>
  );
};