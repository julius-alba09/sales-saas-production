import { memo, useState } from 'react';
import { Card, Button } from '@/components/ui/Optimized';
import { cn } from '@/lib/utils';

interface Organization {
  id: string;
  name: string;
  plan: 'starter' | 'professional' | 'enterprise';
  users: number;
  revenue: number;
  status: 'active' | 'trial' | 'suspended';
  created: string;
}

const OrganizationManagement = memo(() => {
  const [organizations] = useState<Organization[]>([
    { id: '1', name: 'Acme Sales', plan: 'enterprise', users: 45, revenue: 2500, status: 'active', created: '2024-01-15' },
    { id: '2', name: 'Best Sales Co', plan: 'professional', users: 12, revenue: 800, status: 'active', created: '2024-02-01' },
    { id: '3', name: 'Top Sellers', plan: 'starter', users: 3, revenue: 150, status: 'trial', created: '2024-03-10' },
  ]);

  const getPlanColor = (plan: Organization['plan']) => {
    switch (plan) {
      case 'starter': return 'bg-gray-100 text-gray-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Organization['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card title="Organization Management">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Organization</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Plan</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Users</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">MRR</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Created</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{org.name}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getPlanColor(org.plan))}>
                    {org.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900">{org.users}</td>
                <td className="px-4 py-3 text-gray-900">${org.revenue}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getStatusColor(org.status))}>
                    {org.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">{org.created}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">View</Button>
                    <Button size="sm" variant="secondary">Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

export default OrganizationManagement;