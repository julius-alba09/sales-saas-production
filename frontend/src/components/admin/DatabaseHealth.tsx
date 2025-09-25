import { memo } from 'react';
import { Card, Grid } from '@/components/ui/Optimized';

const DatabaseHealth = memo(() => {
  return (
    <Grid columns={3}>
      <Card title="Connection Pool" variant="bordered">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">45/100</div>
          <div className="text-sm text-gray-600">Active connections</div>
        </div>
      </Card>
      
      <Card title="Query Performance" variant="bordered">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">12ms</div>
          <div className="text-sm text-gray-600">Avg query time</div>
        </div>
      </Card>
      
      <Card title="Storage Usage" variant="bordered">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">2.1GB</div>
          <div className="text-sm text-gray-600">Database size</div>
        </div>
      </Card>
    </Grid>
  );
});

export default DatabaseHealth;