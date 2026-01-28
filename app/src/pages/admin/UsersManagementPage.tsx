import { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Lock, UserPlus, Shield, Building2, User } from 'lucide-react';
import { mockUsers, mockPartners } from '@/lib/mockData';
import type { UserRole } from '@/types';

export function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'office_admin':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'partner':
        return <Building2 className="w-4 h-4 text-[#C8FF2E]" />;
      case 'end_user':
        return <User className="w-4 h-4 text-[#A6AEB8]" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      super_admin: 'bg-purple-500/20 text-purple-400',
      office_admin: 'bg-blue-500/20 text-blue-400',
      partner: 'bg-[#C8FF2E]/20 text-[#C8FF2E]',
      end_user: 'bg-[#A6AEB8]/20 text-[#A6AEB8]',
    };
    return styles[role];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">User Management</h1>
          <p className="text-sm text-[#A6AEB8]">Manage all platform users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Create Office Admin
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6AEB8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="input-dark w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#A6AEB8]" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-dark"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="office_admin">Office Admin</option>
            <option value="partner">Partner</option>
            <option value="end_user">End User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C8FF2E]/10">
                <th className="text-left p-4 text-sm font-medium text-[#A6AEB8]">User</th>
                <th className="text-left p-4 text-sm font-medium text-[#A6AEB8]">Role</th>
                <th className="text-left p-4 text-sm font-medium text-[#A6AEB8]">Status</th>
                <th className="text-left p-4 text-sm font-medium text-[#A6AEB8]">Joined</th>
                <th className="text-right p-4 text-sm font-medium text-[#A6AEB8]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#C8FF2E]/5 hover:bg-[#C8FF2E]/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C8FF2E]/10 flex items-center justify-center">
                        <span className="text-[#C8FF2E] text-xs font-semibold">
                          {user.full_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F2F4F8]">{user.full_name}</p>
                        <p className="text-xs text-[#A6AEB8]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoleBadge(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.is_verified
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[#A6AEB8]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[#A6AEB8] hover:text-[#F2F4F8] hover:bg-[#C8FF2E]/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#A6AEB8] hover:text-[#F2F4F8] hover:bg-[#C8FF2E]/10 rounded-lg transition-colors">
                        <Lock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#F2F4F8] mb-4">Create Office Admin</h2>
              <p className="text-sm text-[#A6AEB8] mb-6">
                This feature will allow you to create office admin accounts with specific permissions.
              </p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-primary w-full"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagementPage;
