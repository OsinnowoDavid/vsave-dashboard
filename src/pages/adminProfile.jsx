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

  // Available regions and subregions
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
      
      await deleteAdmin(selectedAdmin._id);
      
      setAdmins(prev => prev.filter(admin => admin._id !== selectedAdmin._id));
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      setSuccess('Admin deleted successfully!');
      
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
      
      await updateAdmin(selectedAdmin._id, updateData);
      
      setAdmins(prev => prev.map(admin => 
        admin._id === selectedAdmin._id ? { ...admin, ...updateData } : admin
      ));
      
      setShowEditModal(false);
      setSelectedAdmin(null);
      setSuccess('Admin updated successfully!');
      
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
      
      const response = await createAdmin(newAdminData);
      
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

  // Styling helper functions
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SUPER ADMIN':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'REGIONAL ADMIN':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'SUBREGIONAL ADMIN':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
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

  // Truncate long text
  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 ml-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading admin data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-20">Admin Management</h1>
                <p className="text-gray-600 mt-2">Manage and monitor all administrator accounts</p>
              </div>
              <div className="mt-4 md:mt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-black hover:bg-green-600 text-white0 text-white px-4 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Users className="w-5 h-5" />
                  <span>Add New Admin</span>
                </button>
                <Link 
                  to="/createRegion" 
                  className="bg-black hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Create Region</span>
                </Link>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center animate-fadeIn">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-green-700 font-medium">{success}</span>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center animate-fadeIn">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { 
                  label: 'Total Admins', 
                  value: admins.length, 
                  icon: Users, 
                  color: 'blue',
                  bg: 'bg-blue-50',
                  iconColor: 'text-blue-600'
                },
                { 
                  label: 'Super Admins', 
                  value: admins.filter(a => a.role === 'SUPER ADMIN').length,
                  icon: Shield, 
                  color: 'purple',
                  bg: 'bg-purple-50',
                  iconColor: 'text-purple-600'
                },
                { 
                  label: 'Regional admin', 
                  value: admins.filter(a => a.status === 'REGIONAL ADMIN').length,
                  icon: UserCheck, 
                  color: 'green',
                  bg: 'bg-green-50',
                  iconColor: 'text-green-600'
                },
                { 
                  label: 'Sub regional Admins', 
                  value: admins.filter(a => a.status === 'SUBREGIONAL ADMIN').length,
                  icon: UserX, 
                  color: 'red',
                  bg: 'bg-red-50',
                  iconColor: 'text-red-600'
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-md mb-6 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search admins by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
  value={filterRole}
  onChange={(e) => setFilterRole(e.target.value)}
  className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg
             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
             appearance-none bg-white min-w-[140px]
             accent-emerald-500"
>
  <option className='mouse-black' value="all">All Roles</option>
  <option value="SUPER ADMIN">Super Admin</option>
  <option value="REGIONAL ADMIN">Regional Admin</option>
  <option value="SUBREGIONAL ADMIN">Sub Regional Admin</option>
</select>

                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white min-w-[140px]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <button 
                  className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-200"
                  onClick={fetchAdmins}
                >
                  <Loader2 className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {sortedAdmins.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No admins found</h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No admin accounts have been created yet'}
                </p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
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
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
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
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Regions
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
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
                        {/* <th 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                          onClick={() => handleSort('status')}
                        > */}
                          {/* <div className="flex items-center space-x-1">
                            <span>Status</span>
                            {sortConfig.key === 'status' && (
                              <span className="text-gray-400">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div> */}
                        {/* </th> */}
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
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
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentAdmins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                                {(admin.firstName?.[0] || 'A')}{(admin.lastName?.[0] || '')}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {admin.firstName || 'Unknown'} {admin.lastName || ''}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                  ID: {admin._id?.substring(0, 8) || 'N/A'}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="truncate max-w-[180px]">{admin.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span>{admin.phoneNumber || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(admin.region) && admin.region.length > 0 
                                  ? admin.region.slice(0, 2).map((region, index) => (
                                      <span key={index} className="inline-block bg-black text-white text-xs px-2 py-1 rounded border border-blue-100 truncate max-w-[120px]">
                                        {truncateText(region, 15)}
                                      </span>
                                    ))
                                  : <span className="text-gray-400 text-sm">No region</span>
                                }
                                {Array.isArray(admin.region) && admin.region.length > 2 && (
                                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    +{admin.region.length - 2}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(admin.subRegion) && admin.subRegion.length > 0 
                                  ? admin.subRegion.slice(0, 1).map((subRegion, index) => (
                                      <span key={index} className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-100 truncate max-w-[120px]">
                                        {truncateText(subRegion, 15)}
                                      </span>
                                    ))
                                  : <span className="text-gray-400 text-sm">No sub-region</span>
                                }
                                {Array.isArray(admin.subRegion) && admin.subRegion.length > 1 && (
                                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    +{admin.subRegion.length - 1}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(admin.role)}`}>
                              {admin.role || 'N/A'}
                            </span>
                          </td>
                          {/* <td className="px-6 py-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(admin.status)}`}>
                              {(admin.status || 'active').charAt(0).toUpperCase() + (admin.status || 'active').slice(1)}
                            </span>
                          </td> */}
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span>{formatDate(admin.lastLogin)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {/* <button
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setShowDetailsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-150"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button> */}
                              <button
                                onClick={() => openEditModal(admin)}
                                className="text-emerald-600 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors duration-150"
                                title="Edit Admin"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(admin)}
                                className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors duration-150"
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{' '}
                        <span className="font-semibold">
                          {Math.min(indexOfLastItem, sortedAdmins.length)}
                        </span>{' '}
                        of <span className="font-semibold">{sortedAdmins.length}</span> results
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1.5 rounded-lg border ${
                            currentPage === 1 
                              ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                              : 'hover:bg-gray-100 bg-white'
                          } transition-colors duration-150`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => page >= currentPage - 1 && page <= currentPage + 1)
                          .map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3.5 py-1.5 rounded-lg border ${
                                currentPage === page
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'hover:bg-gray-100 bg-white'
                              } transition-colors duration-150`}
                            >
                              {page}
                            </button>
                          ))}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1.5 rounded-lg border ${
                            currentPage === totalPages 
                              ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                              : 'hover:bg-gray-100 bg-white'
                          } transition-colors duration-150`}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Admin Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Modal content remains similar but with improved styling */}
              {/* ... rest of modal content ... */}
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal - with improved styling */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Admin</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Form with improved styling */}
              <form onSubmit={handleEdit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-white"
                    >
                      <option value="SUPER ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Moderator</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Regions Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleRegionSelect(region)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors duration-200 flex items-center ${
                          editForm.region.includes(region)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {region}
                        {editForm.region.includes(region) && (
                          <Check className="w-3 h-3 ml-1.5 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-regions Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sub-regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subRegions.map((subRegion) => (
                      <button
                        key={subRegion}
                        type="button"
                        onClick={() => handleSubRegionSelect(subRegion)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors duration-200 flex items-center ${
                          editForm.subRegion.includes(subRegion)
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {subRegion}
                        {editForm.subRegion.includes(subRegion) && (
                          <Check className="w-3 h-3 ml-1.5 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center transition-colors duration-200 shadow-md hover:shadow-lg"
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

      {/* Add Admin Modal - similar improvements as edit modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Admin</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Similar form structure as edit modal with password fields */}
              {/* ... rest of add modal content ... */}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Admin</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 font-medium">
                  Are you sure you want to delete <span className="font-semibold">{selectedAdmin.firstName} {selectedAdmin.lastName}</span>?
                </p>
                <p className="text-red-600 text-sm mt-2">
                  This admin will be permanently removed from the system.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center transition-colors duration-200 shadow-md hover:shadow-lg"
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

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AdminDetails;