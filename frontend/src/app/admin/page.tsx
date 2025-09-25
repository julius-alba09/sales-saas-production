import { Suspense, lazy } from 'react';
import { Navigation } from '@/components/navigation/Navigation';
import { PageHeader, Section, Grid, Card } from '@/components/ui/Optimized';
import { Skeleton } from '@/components/ui/Skeleton';

// Lazy load heavy components for better performance
const SystemMetrics = lazy(() => import('@/components/admin/SystemMetrics'));
const UserManagement = lazy(() => import('@/components/admin/UserManagement'));
const OrganizationManagement = lazy(() => import('@/components/admin/OrganizationManagement'));
const PerformanceMonitor = lazy(() => import('@/components/admin/PerformanceMonitor'));
const DatabaseHealth = lazy(() => import('@/components/admin/DatabaseHealth'));

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <PageHeader 
        title="Internal Management Dashboard"
        description="System administration and monitoring for platform operations"
      />
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Quick Stats */}
        <Section title="Platform Overview" icon="📊">
          <Grid columns={3}>
            <Card title="Active Users" variant="highlighted">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">2,847</div>
                <div className="text-sm text-gray-600">↑ 12% from last month</div>
              </div>
            </Card>
            
            <Card title="Organizations" variant="highlighted">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">156</div>
                <div className="text-sm text-gray-600">↑ 8% from last month</div>
              </div>
            </Card>
            
            <Card title="Revenue" variant="highlighted">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">$89.2K</div>
                <div className="text-sm text-gray-600">↑ 15% from last month</div>
              </div>
            </Card>
          </Grid>
        </Section>

        {/* System Health */}
        <Section title="System Health" icon="🏥">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <SystemMetrics />
          </Suspense>
        </Section>

        {/* User Management */}
        <Section title="User Management" icon="👥">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <UserManagement />
          </Suspense>
        </Section>

        {/* Organization Management */}
        <Section title="Organization Management" icon="🏢">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <OrganizationManagement />
          </Suspense>
        </Section>

        {/* Performance Monitoring */}
        <Section title="Performance Analytics" icon="⚡">
          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            <PerformanceMonitor />
          </Suspense>
        </Section>

        {/* Database Health */}
        <Section title="Database Health" icon="🗄️">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <DatabaseHealth />
          </Suspense>
        </Section>

      </div>
    </div>
  );
}