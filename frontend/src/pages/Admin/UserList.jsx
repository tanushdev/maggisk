import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, updateUserRole } from '../../services/api';
import { Trash2, User, Shield, ShieldCheck, Search, Mail, Calendar } from 'lucide-react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const getUsers = async () => {
        try {
            setLoading(true);
            const { data } = await fetchUsers();
            setUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleDelete = async (id, isAdmin) => {
        if (isAdmin) {
            alert('Cannot delete an admin user via this panel for security. Please use database tools if absolutely necessary.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                getUsers();
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Deletion failed. Check console for details.');
            }
        }
    };

    const toggleAdmin = async (user) => {
        const newAdminStatus = !user.isAdmin;
        const msg = newAdminStatus 
            ? `Give Admin privileges to ${user.email}?` 
            : `Revoke Admin privileges from ${user.email}?`;
        
        if (window.confirm(msg)) {
            try {
                await updateUserRole(user._id, { isAdmin: newAdminStatus });
                getUsers();
            } catch (err) {
                console.error('Update failed:', err);
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin User Management</h1>
                    <span className="bg-theme-rust/10 text-theme-rust text-[10px] font-bold px-2 py-0.5 rounded-full border border-theme-rust/20">
                        {users.length} Registered
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Manage administrative privileges and user accounts</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-theme-rust shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-2 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading User Data...</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Admin Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user.name}</p>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                                                            <Mail size={10} />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <button 
                                                        onClick={() => toggleAdmin(user)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                            user.isAdmin 
                                                            ? 'bg-theme-rust/5 text-theme-rust border-theme-rust/20' 
                                                            : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {user.isAdmin ? <ShieldCheck size={14} /> : <Shield size={14} />}
                                                        {user.isAdmin ? 'Administrator' : 'General User'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                                                    <Calendar size={14} />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(user._id, user.isAdmin)}
                                                    className={`p-2 transition-colors ${user.isAdmin ? 'text-gray-200 cursor-not-allowed' : 'text-gray-300 hover:text-red-500'}`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center">
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No users found matching your search</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
