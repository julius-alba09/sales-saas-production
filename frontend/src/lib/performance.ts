/**
 * Performance Monitoring Utilities
 * Runtime performance tracking and optimization
 */

interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private timers: Map<string, number> = new Map();

  // Start timing an operation
  start(name: string) {
    this.timers.set(name, performance.now());
  }

  // End timing and record metric
  end(name: string) {
    const startTime = this.timers.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.push({
        name,
        duration,
        timestamp: Date.now()
      });
      this.timers.delete(name);
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`🐌 Slow operation: ${name} took ${duration.toFixed(2)}ms`);
      }
    }
  }

  // Get all metrics
  getMetrics() {
    return [...this.metrics];
  }

  // Get average duration for operation type
  getAverage(name: string) {
    const operationMetrics = this.metrics.filter(m => m.name === name);
    if (operationMetrics.length === 0) return 0;
    
    const total = operationMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / operationMetrics.length;
  }

  // Clear all metrics
  clear() {
    this.metrics = [];
    this.timers.clear();
  }
}

// Singleton instance
export const perfMonitor = new PerformanceMonitor();

// Decorator for timing function execution
export function timed(name?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const timerName = name || `${target.constructor.name}.${propertyName}`;
    
    descriptor.value = function (...args: any[]) {
      perfMonitor.start(timerName);
      const result = method.apply(this, args);
      
      if (result instanceof Promise) {
        return result.finally(() => perfMonitor.end(timerName));
      } else {
        perfMonitor.end(timerName);
        return result;
      }
    };
  };
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// Bundle analysis helper
export function logBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Log estimated bundle size based on script tags
    const scripts = document.querySelectorAll('script[src]');
    console.log(`📦 Loaded ${scripts.length} script files`);
  }
}

// Memory usage tracking (development only)
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  const logMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('💾 Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
      });
    }
  };

  // Log memory usage every 30 seconds
  setInterval(logMemory, 30000);
}

// React component performance wrapper
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  name?: string
) {
  const componentName = name || Component.displayName || Component.name;
  
  return function PerformanceWrappedComponent(props: P) {
    perfMonitor.start(`render-${componentName}`);
    
    React.useEffect(() => {
      perfMonitor.end(`render-${componentName}`);
    });
    
    return React.createElement(Component, props);
  };
}