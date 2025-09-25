import { memo } from 'react';
import { Card, Grid } from '@/components/ui/Optimized';

const PerformanceMonitor = memo(() => {
  const metrics = [
    { label: 'Page Load Time', value: '1.2s', trend: 'down' },
    { label: 'API Response Time', value: '250ms', trend: 'stable' },
    { label: 'Error Rate', value: '0.1%', trend: 'down' },
    { label: 'Uptime', value: '99.9%', trend: 'up' },
  ];

  return (
    <Grid columns={2}>
      <Card title="Performance Metrics">
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-gray-600">{metric.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{metric.value}</span>
                <span className="text-xs">
                  {metric.trend === 'up' && '↗️'}
                  {metric.trend === 'down' && '↘️'}
                  {metric.trend === 'stable' && '➡️'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Bundle Analysis">
        <div className="text-center py-8">
          <div className="text-2xl font-bold text-green-600 mb-2">892 KB</div>
          <div className="text-sm text-gray-600">Total bundle size</div>
          <div className="mt-4 text-xs text-gray-500">
            85% smaller than previous version
          </div>
        </div>
      </Card>
    </Grid>
  );
});

export default PerformanceMonitor;