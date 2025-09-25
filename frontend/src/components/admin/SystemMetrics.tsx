import { memo, useState, useEffect } from 'react';
import { Grid, Card } from '@/components/ui/Optimized';
import { cn } from '@/lib/utils';

interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

const SystemMetrics = memo(() => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchMetrics = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics([
        { label: 'CPU Usage', value: 24, unit: '%', status: 'good', trend: 'stable' },
        { label: 'Memory Usage', value: 67, unit: '%', status: 'warning', trend: 'up' },
        { label: 'Disk Usage', value: 45, unit: '%', status: 'good', trend: 'down' },
        { label: 'Network I/O', value: 1.2, unit: 'GB/s', status: 'good', trend: 'up' },
        { label: 'Database Connections', value: 45, unit: '', status: 'good', trend: 'stable' },
        { label: 'Queue Length', value: 12, unit: 'jobs', status: 'good', trend: 'down' },
      ]);
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Grid columns={3}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg" />
        ))}
      </Grid>
    );
  }

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: SystemMetric['trend']) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  return (
    <Grid columns={3}>
      {metrics.map((metric, index) => (
        <Card key={index} title={metric.label} variant="bordered">
          <div className="text-center">
            <div className={cn('text-3xl font-bold mb-2', getStatusColor(metric.status))}>
              {metric.value}{metric.unit}
            </div>
            <div className="text-sm text-gray-600">
              {getTrendIcon(metric.trend)} Status: {metric.status}
            </div>
          </div>
        </Card>
      ))}
    </Grid>
  );
});

export default SystemMetrics;