import React, { useState, useEffect } from 'react';
import Header from '../component/NavBar';
import Sidebar from '../component/SideBar';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
  UserCheck,
  UserX,
  Calendar,
  Loader2,
  AlertCircle,
  Save,
  X,
  Key,
  MapPin,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllAdmin, deleteAdmin, updateAdmin, createAdmin } from '../api/admin';

function AdminDetails() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'ADMIN',
    status: 'active',
    region: [],
    subRegion: []
  });

  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
    region: [],
    subRegion: []
  });

  // Available regions and subregions (you can fetch these from API)
  const [regions, setRegions] = useState(['Lagos Region', 'Abuja Region', 'Port Harcourt Region', 'Kano Region', 'Ibadan Region']);
  const [subRegions, setSubRegions] = useState([
    'Lagos Mainland', 'Lagos Island', 'Abuja Central', 'PHC Zone A', 'PHC Zone B',
    'Kano Central', 'Ibadan North'
  ]);

  // Fetch admin data
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllAdmin();
      
      let adminData = [];
      
      if (response && response.data) {
        adminData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        adminData = response;
      } else if (response && response.Status === "success" && Array.isArray(response.data)) {
        adminData = response.data;
      }
      
      const adminsWithStatus = adminData.map(admin => ({
        ...admin,
        status: admin.status || 'active',
        lastLogin: admin.lastLogin || new Date().toISOString(),
        createdAt: admin.createdAt || new Date().toISOString()
      }));
      
      setAdmins(adminsWithStatus);
      
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError(error.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle delete admin
  const handleDelete = async () => {
    if (!selectedAdmin) return;
    
    try {
      setDeleteLoading(true);
      
      // Call delete API
      await deleteAdmin(selectedAdmin._id);
      
      // Remove from local state
      setAdmins(prev => prev.filter(admin => admin._id !== selectedAdmin._id));
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      setSuccess('Admin deleted successfully!');
      
      // Clear success message
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error deleting admin:', error);
      setError('Failed to delete admin. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit admin
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    
    try {
      setEditLoading(true);
      
      // Prepare update data
      const updateData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        role: editForm.role,
        status: editForm.status,
        region: editForm.region,
        subRegion: editForm.subRegion
      };
      
      // Call update API
      const response = await updateAdmin(selectedAdmin._id, updateData);
      
      // Update local state
      setAdmins(prev => prev.map(admin => 
        admin._id === selectedAdmin._id ? { ...admin, ...updateData } : admin
      ));
      
      setShowEditModal(false);
      setSelectedAdmin(null);
      setSuccess('Admin updated successfully!');
      
      // Clear success message
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error updating admin:', error);
      setError(error.message || 'Failed to update admin. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle add admin
  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (addForm.password !== addForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setAddLoading(true);
      
      // Prepare new admin data
      const newAdminData = {
        firstName: addForm.firstName,
        lastName: addForm.lastName,
        email: addForm.email,
        phoneNumber: addForm.phoneNumber,
        password: addForm.password,
        role: addForm.role,
        region: addForm.region,
        subRegion: addForm.subRegion
      };
      
      // Call create API
      const response = await createAdmin(newAdminData);
      
      // Add to local state
      const newAdmin = {
        ...newAdminData,
        _id: response.data?._id || Date.now().toString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        __v: 0
      };
      
      setAdmins(prev => [...prev, newAdmin]);
      setShowAddModal(false);
      resetAddForm();
      setSuccess('Admin created successfully!');
      
      // Clear success message
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error creating admin:', error);
      setError(error.message || 'Failed to create admin. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // Reset add form
  const resetAddForm = () => {
    setAddForm({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'ADMIN',
      region: [],
      subRegion: []
    });
  };

  // Open edit modal with admin data
  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
      email: admin.email || '',
      phoneNumber: admin.phoneNumber || '',
      role: admin.role || 'ADMIN',
      status: admin.status || 'active',
      region: Array.isArray(admin.region) ? [...admin.region] : [],
      subRegion: Array.isArray(admin.subRegion) ? [...admin.subRegion] : []
    });
    setShowEditModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  // Handle region selection for forms
  const handleRegionSelect = (region, formType = 'edit') => {
    if (formType === 'edit') {
      setEditForm(prev => ({
        ...prev,
        region: prev.region.includes(region)
          ? prev.region.filter(r => r !== region)
          : [...prev.region, region]
      }));
    } else {
      setAddForm(prev => ({
        ...prev,
        region: prev.region.includes(region)
          ? prev.region.filter(r => r !== region)
          : [...prev.region, region]
      }));
    }
  };

  // Handle subregion selection for forms
  const handleSubRegionSelect = (subRegion, formType = 'edit') => {
    if (formType === 'edit') {
      setEditForm(prev => ({
        ...prev,
        subRegion: prev.subRegion.includes(subRegion)
          ? prev.subRegion.filter(sr => sr !== subRegion)
          : [...prev.subRegion, subRegion]
      }));
    } else {
      setAddForm(prev => ({
        ...prev,
        subRegion: prev.subRegion.includes(subRegion)
          ? prev.subRegion.filter(sr => sr !== subRegion)
          : [...prev.subRegion, subRegion]
      }));
    }
  };

  // Filter and search logic
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      (admin.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (admin.phoneNumber || '').includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sorting logic
  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    if (sortConfig.key === 'name') {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`;
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`;
      return sortConfig.direction === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = sortedAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage) || 1;

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SUPER ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'MODERATOR':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 ml-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading admin data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 ">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-20">Admin Management</h1>
                <p className="text-gray-600 mt-2">Manage and monitor all administrator accounts</p>
              </div>
              <div className="mt-4 md:mt-3 flex gap-5">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Add New Admin</span>
                </button>
                <Link to="/createRegion" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Create Region</span>
                </Link>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-green-700">{success}</span>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Admins</p>
                    <p className="text-2xl font-bold text-gray-800">{admins.length}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Super Admins</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {admins.filter(a => a.role === 'SUPER ADMIN').length}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Admins</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {admins.filter(a => a.status === 'active').length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Inactive Admins</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {admins.filter(a => a.status === 'inactive').length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow mb-6 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search admins by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="SUPER ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <button 
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  onClick={fetchAdmins}
                >
                  <Loader2 className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {sortedAdmins.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No admin accounts have been created yet'}
                </p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add First Admin
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Admin Name</span>
                            {sortConfig.key === 'name' && (
                              <span className="text-gray-400">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Regions
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('role')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Role</span>
                            {sortConfig.key === 'role' && (
                              <span className="text-gray-400">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            {sortConfig.key === 'status' && (
                              <span className="text-gray-400">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('lastLogin')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Last Login</span>
                            {sortConfig.key === 'lastLogin' && (
                              <span className="text-gray-400">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentAdmins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {(admin.firstName?.[0] || 'A')}{(admin.lastName?.[0] || '')}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {admin.firstName || 'Unknown'} {admin.lastName || ''}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {admin._id?.substring(0, 8) || 'N/A'}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                {admin.email || 'N/A'}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {admin.phoneNumber || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-900">
                                {Array.isArray(admin.region) && admin.region.length > 0 
                                  ? admin.region.join(', ') 
                                  : 'No region assigned'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {Array.isArray(admin.subRegion) && admin.subRegion.length > 0 
                                  ? admin.subRegion.join(', ') 
                                  : 'No sub-region'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(admin.role)}`}>
                              {admin.role || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(admin.status)}`}>
                              {(admin.status || 'active').charAt(0).toUpperCase() + (admin.status || 'active').slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatDate(admin.lastLogin)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setShowDetailsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => openEditModal(admin)}
                                className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50"
                                title="Edit Admin"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(admin)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Delete Admin"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {sortedAdmins.length > itemsPerPage && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(indexOfLastItem, sortedAdmins.length)}
                          </span>{' '}
                          of <span className="font-medium">{sortedAdmins.length}</span> results
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => page >= currentPage - 1 && page <= currentPage + 1)
                          .map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded border ${
                                currentPage === page
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Admin Details Modal */}
      {showDetailsModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Admin Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {(selectedAdmin.firstName?.[0] || 'A')}{(selectedAdmin.lastName?.[0] || '')}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {selectedAdmin.firstName || ''} {selectedAdmin.lastName || ''}
                    </h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeClass(selectedAdmin.role)}`}>
                        {selectedAdmin.role || 'N/A'}
                      </span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(selectedAdmin.status)}`}>
                        {selectedAdmin.status || 'active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      <div className="flex items-center text-gray-800">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedAdmin.email || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <div className="flex items-center text-gray-800">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedAdmin.phoneNumber || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Admin ID</label>
                      <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {selectedAdmin._id || 'N/A'}
                      </code>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Assigned Regions</label>
                      <div className="space-y-2">
                        {Array.isArray(selectedAdmin.region) && selectedAdmin.region.length > 0 ? (
                          selectedAdmin.region.map((region, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                              {region}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No regions assigned</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Sub-regions</label>
                      <div className="space-y-2">
                        {Array.isArray(selectedAdmin.subRegion) && selectedAdmin.subRegion.length > 0 ? (
                          selectedAdmin.subRegion.map((subRegion, index) => (
                            <span key={index} className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                              {subRegion}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No sub-regions assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border-t pt-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-4">Additional Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Account Created</label>
                      <div className="flex items-center text-sm text-gray-800">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(selectedAdmin.createdAt)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Last Login</label>
                      <div className="flex items-center text-sm text-gray-800">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(selectedAdmin.lastLogin)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    openEditModal(selectedAdmin);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Edit Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Admin</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleEdit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="SUPER ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Moderator</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Regions Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleRegionSelect(region)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          editForm.region.includes(region)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {region}
                        {editForm.region.includes(region) && (
                          <Check className="w-3 h-3 ml-1 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-regions Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subRegions.map((subRegion) => (
                      <button
                        key={subRegion}
                        type="button"
                        onClick={() => handleSubRegionSelect(subRegion)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          editForm.subRegion.includes(subRegion)
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {subRegion}
                        {editForm.subRegion.includes(subRegion) && (
                          <Check className="w-3 h-3 ml-1 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {editLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Admin</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAdd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={addForm.firstName}
                      onChange={(e) => setAddForm({...addForm, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={addForm.lastName}
                      onChange={(e) => setAddForm({...addForm, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={addForm.email}
                      onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={addForm.phoneNumber}
                      onChange={(e) => setAddForm({...addForm, phoneNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={addForm.role}
                      onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="SUPER ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Moderator</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={addForm.password}
                        onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                      <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={addForm.confirmPassword}
                        onChange={(e) => setAddForm({...addForm, confirmPassword: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                      <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    {addForm.password && addForm.confirmPassword && addForm.password !== addForm.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                {/* Regions Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleRegionSelect(region, 'add')}
                        className={`px-3 py-1 rounded-full text-sm ${
                          addForm.region.includes(region)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {region}
                        {addForm.region.includes(region) && (
                          <Check className="w-3 h-3 ml-1 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-regions Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subRegions.map((subRegion) => (
                      <button
                        key={subRegion}
                        type="button"
                        onClick={() => handleSubRegionSelect(subRegion, 'add')}
                        className={`px-3 py-1 rounded-full text-sm ${
                          addForm.subRegion.includes(subRegion)
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {subRegion}
                        {addForm.subRegion.includes(subRegion) && (
                          <Check className="w-3 h-3 ml-1 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetAddForm();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={addLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading || addForm.password !== addForm.confirmPassword}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {addLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Create Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Delete Admin</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">
                  Are you sure you want to delete <span className="font-semibold">{selectedAdmin.firstName} {selectedAdmin.lastName}</span>?
                </p>
                <p className="text-red-600 text-sm mt-1">
                  This admin will be permanently removed from the system.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Admin'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDetails;