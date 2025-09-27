'use client';
import { memo, useState, useCallback, useEffect } from 'react';
import { Button, Card } from '@/components/ui/Optimized';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales_rep' | 'setter';
  status: 'active' | 'inactive' | 'suspended';
  organization: string;
  lastActive: string;
}

const UserManagement = memo(() => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'sales_rep' as User['role']
  });

  // Fetch users from database using the new function
  const fetchUsers = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .rpc('get_organization_users');

      if (error) throw error;

      const formattedUsers = data?.map((u: any) => ({
        id: u.user_id,
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        role: u.role as User['role'],
        status: u.is_active ? 'active' : 'inactive' as User['status'],
        organization: user.profile?.organization?.name || 'Your Organization',
        lastActive: u.last_login_at ? 
          new Date(u.last_login_at).toLocaleDateString() : 'Never'
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'sales_rep': return 'bg-green-100 text-green-800';
      case 'setter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800'; 
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Invite new user
  const handleInviteUser = useCallback(async () => {
    if (!user || !inviteForm.email || !inviteForm.firstName || !inviteForm.lastName) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // First, validate the invitation using our database function
      const { data: inviteData, error: inviteError } = await supabase
        .rpc('invite_user_to_organization', {
          user_email: inviteForm.email,
          user_first_name: inviteForm.firstName,
          user_last_name: inviteForm.lastName,
          user_role: inviteForm.role
        });

      if (inviteError) throw inviteError;

      // For local development, we'll just show a message with the signup link
      const signupUrl = `${window.location.origin}/auth/register`;
      
      alert(`User invitation prepared! Send them this link to join: ${signupUrl}\n\nThey should:\n1. Click "Join Team"\n2. Enter their details\n3. Use email: ${inviteForm.email}\n4. Their role will be: ${inviteForm.role}`);
      setInviteModalOpen(false);
      setInviteForm({
        email: '',
        firstName: '',
        lastName: '',
        role: 'sales_rep'
      });
      
      // Refresh user list
      await fetchUsers();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      alert(error.message || 'Failed to invite user. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, inviteForm, fetchUsers]);

  // Toggle user active status
  const handleToggleUserStatus = useCallback(async (userId: string, currentStatus: User['status']) => {
    try {
      setLoading(true);
      
      const newStatus = currentStatus === 'active' ? false : true;
      
      const { data, error } = await supabase
        .rpc('update_user_status', {
          target_user_id: userId,
          new_status: newStatus
        });

      if (error) throw error;

      alert(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating user status:', error);
      alert(error.message || 'Failed to update user status.');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const handleUserAction = useCallback((userId: string, action: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (action === 'suspend' || action === 'activate') {
      handleToggleUserStatus(userId, user.status);
    } else if (action === 'edit') {
      // TODO: Implement edit user modal
      console.log('Edit user:', userId);
    }
  }, [users, handleToggleUserStatus]);

  return (
    <Card title="User Management">
      {/* Header with Invite Button */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <Button
          onClick={() => setInviteModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Invite User
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">User</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Organization</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Last Active</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(user.role))}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(user.status))}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900">{user.organization}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">{user.lastActive}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUserAction(user.id, 'edit')}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching your criteria.
        </div>
      )}

      {/* Invite User Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Invite New User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sales_rep">Sales Rep</option>
                  <option value="setter">Appointment Setter</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setInviteModalOpen(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInviteUser}
                disabled={loading || !inviteForm.email || !inviteForm.firstName || !inviteForm.lastName}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
});

export default UserManagement;