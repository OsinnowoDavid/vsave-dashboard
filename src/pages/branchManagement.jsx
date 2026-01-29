import React, { useState, useEffect } from 'react';

import Header from '../component/NavBar';
import Sidebar from '../component/SideBar';
import { getAllAdmin, createRegion, getRegion } from '../api/branchManagement';
import { toast } from 'react-toastify';
import { createTeam, getAllteam } from '../api/branchManagement';
function BranchManagement() {
  // State management
  const [userRole, setUserRole] = useState('superadmin'); // superadmin, region-admin, team-leader
  const [activeTab, setActiveTab] = useState('create');
  const [viewType, setViewType] = useState('regions'); // regions, teams, markets, onboarding-chain

  // Data states
  const [regions, setRegions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [onboardingChain, setOnboardingChain] = useState([]);
  const [admin, setAdmin] = useState([])
  const [mockRegions, setMockRegions] = useState([])
  // Form states
  const [regionForm, setRegionForm] = useState({
    email: '',
    location: '',
    regionName: ''
  });

  const [teamForm, setTeamForm] = useState({
    subRegionName: '',
    region: '',
    location: '',
    admin: '',

  });

  const [marketForm, setMarketForm] = useState({
    teamId: '',
    name: '',
    location: '',
    referralCode: '',
    marketAdmin: ''
  });

  const [userForm, setUserForm] = useState({
    marketId: '',
    fullName: '',
    email: '',
    phone: '',
    referralCode: '',
    referredBy: ''
  });
  const getAdmin = async () => {
    try {
      const data = await getAllAdmin()
      console.log("ADMINS", data)
      setAdmin(data?.data)
      return data

    } catch (error) {
      console.log(error)

    }


  }
  const getRegionData = async () => {
    try {
      const data = await getRegion()
      setMockRegions(data?.data)
      console.log("REGION", data)
      return data

    } catch (error) {
      console.log(error)

    }
  }
  const getTeamData = async () => {
    try {
      const data = await getAllteam()
      setTeams(data?.data)
      console.log("TEAM", data)
      return data

    } catch (error) {
      console.log(error)

    }
  }

  // Sample data for demonstration
  useEffect(() => {
    getAdmin()
    getRegionData()
    getTeamData()
    // Mock data
    // const mockReg  ions = [
    //   { id: 1, name: 'North Region', location: 'City A', admin: 'John Doe', teams: 5, createdAt: '2024-01-15' },
    //   { id: 2, name: 'South Region', location: 'City B', admin: 'Jane Smith', teams: 3, createdAt: '2024-01-20' },
    // ];

    // const mockTeams = [
    //   { id: 1, regionId: 1, title: 'Sales Team Alpha', location: 'District 1', email: 'alpha@company.com', teamLeader: 'Mike Johnson', markets: 8 },
    //   { id: 2, regionId: 1, title: 'Support Team Beta', location: 'District 2', email: 'beta@company.com', teamLeader: 'Sarah Williams', markets: 5 },
    // ];

    const mockMarkets = [
      { id: 1, teamId: 1, name: 'Downtown Market', location: 'Downtown Area', referralCode: 'DTM001', marketAdmin: 'Robert Chen', users: 45 },
      { id: 2, teamId: 1, name: 'Uptown Market', location: 'Uptown Area', referralCode: 'UPM002', marketAdmin: 'Lisa Brown', users: 32 },
    ];

    const mockChain = [
      { id: 1, user: 'User A', code: 'REF001', date: '2024-01-10', referredBy: 'Admin', referredCount: 5 },
      { id: 2, user: 'User B', code: 'REF002', date: '2024-01-12', referredBy: 'User A', referredCount: 3 },
      { id: 3, user: 'User C', code: 'REF003', date: '2024-01-14', referredBy: 'User B', referredCount: 2 },
    ];

    setRegions(mockRegions);
    // setTeams(mockTeams);
    setMarkets(mockMarkets);
    setOnboardingChain(mockChain);
  }, []);

  // Form handlers
  const handleRegionSubmit = async (e) => {
    e.preventDefault();
    const newRegion = {
      // id: regions.length + 1,
      ...regionForm,

    };
    console.log("REGION", newRegion)
    try {
      const response = await createRegion(newRegion)
      console.log("CREATE-REGION RESPONSE", response)
    } catch (error) {
      console.log(error)

    }
    setRegions([...regions, newRegion]);
    setRegionForm({ name: '', location: '', regionName: '' });
    toast.success("Region created successfully!")

  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createTeam(teamForm)
      console.log("CREATE-TEAM RESPONSE", response)
      toast.success("Team created successfully!")
      setTeamForm({ subRegionName: '', title: '', location: '', email: '', teamLeader: '' });
    } catch (error) {
      console.log(error)

    }

  };

  const handleMarketSubmit = (e) => {
    e.preventDefault();
    const newMarket = {
      id: markets.length + 1,
      ...marketForm,
      users: 0
    };
    setMarkets([...markets, newMarket]);
    setMarketForm({ teamId: '', name: '', location: '', referralCode: '', marketAdmin: '' });
    alert('Market created successfully!');
  };

  const handleUserOnboarding = (e) => {
    e.preventDefault();
    // Track onboarding chain
    const newUser = {
      id: onboardingChain.length + 1,
      user: userForm.fullName,
      code: userForm.referralCode || `USER${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      referredBy: userForm.referredBy || 'Direct',
      referredCount: 0
    };

    // Update referral chain if applicable
    if (userForm.referredBy) {
      const updatedChain = onboardingChain.map(item =>
        item.code === userForm.referredBy
          ? { ...item, referredCount: item.referredCount + 1 }
          : item
      );
      setOnboardingChain([...updatedChain, newUser]);
    } else {
      setOnboardingChain([...onboardingChain, newUser]);
    }

    setUserForm({ marketId: '', fullName: '', email: '', phone: '', referralCode: '', referredBy: '' });
    alert('User onboarded successfully!');
  };

  // Render forms based on user role
  const renderForm = () => {
    switch (userRole) {
      case 'superadmin':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-800 mb-6">Create New Region</h3>
            <form onSubmit={handleRegionSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region Name</label>
                  <input
                    type="text"
                    value={regionForm.regionName}
                    onChange={(e) => setRegionForm({ ...regionForm, regionName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter region name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={regionForm.location}
                    onChange={(e) => setRegionForm({ ...regionForm, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter location"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region Admin</label>
                  <select
                    value={regionForm.admin}
                    onChange={(e) => setRegionForm({ ...regionForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="" >Select an admin</option>
                    {admin.map((adminItem) => (
                      <option key={adminItem._id} value={adminItem._id}>
                        {adminItem.firstName} {adminItem.lastName} ({adminItem.email})
                      </option>
                    ))}
                  </select>

                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Create Region
              </button>
            </form>
          </div>
        );

      case 'region-admin':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-800 mb-6">Create New Team</h3>
            <form onSubmit={handleTeamSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamForm.subRegionName}
                    onChange={(e) => setTeamForm({ ...teamForm, subRegionName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter team title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={teamForm.location}
                    onChange={(e) => setTeamForm({ ...teamForm, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={teamForm.region}
                    onChange={(e) => setTeamForm({ ...teamForm, region: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="" >Select region</option>
                    {mockRegions.map((region) => (
                      <option key={region._id} value={region._id}>
                        {region.regionName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="">
                  <label className=" text-sm font-medium text-gray-700 mb-2">Region Admin</label>
                  <select
                    value={teamForm.admin}
                    onChange={(e) => setTeamForm({ ...teamForm, admin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="" >Select an admin</option>
                    {admin.map((adminItem) => (
                      <option key={adminItem._id} value={adminItem._id}>
                        {adminItem.firstName} {adminItem.lastName} ({adminItem.role})
                      </option>
                    ))}
                  </select>

                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Create Team
              </button>
            </form>
          </div>
        );

      case 'team-leader':
        if (activeTab === 'create') {
          return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-6">Create New Market</h3>
              <form onSubmit={handleMarketSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Name</label>
                    <input
                      type="text"
                      value={marketForm.name}
                      onChange={(e) => setMarketForm({ ...marketForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter market name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={marketForm.location}
                      onChange={(e) => setMarketForm({ ...marketForm, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter location"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
                    <input
                      type="text"
                      value={marketForm.referralCode}
                      onChange={(e) => setMarketForm({ ...marketForm, referralCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Generate referral code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Admin</label>
                    <input
                      type="text"
                      value={marketForm.marketAdmin}
                      onChange={(e) => setMarketForm({ ...marketForm, marketAdmin: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Assign market admin"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Create Market
                </button>
              </form>
            </div>
          );
        } else {
          return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-6">Onboard New User</h3>
              <form onSubmit={handleUserOnboarding}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
                    <input
                      type="text"
                      value={userForm.referralCode}
                      onChange={(e) => setUserForm({ ...userForm, referralCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="User referral code"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referred By (Code)</label>
                    <input
                      type="text"
                      value={userForm.referredBy}
                      onChange={(e) => setUserForm({ ...userForm, referredBy: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter referral code of referrer"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Onboard User
                </button>
              </form>
            </div>
          );
        }

      default:
        return null;
    }
  };

  // Render data tables based on view type
  const renderDataTable = () => {
    switch (viewType) {
      case 'regions':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-emerald-800">Regions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Region Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Teams</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Created</th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockRegions.map(region => (
                    <tr key={region.id} className="hover:bg-emerald-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{region.regionName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{region.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{region.admin?.[0]?.firstName}{" "} {region.admin?.[0]?.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {region.teams.length}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-gray-700">{region.createdAt}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'teams':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-emerald-800">Teams</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Team Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Team Leader</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Markets</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teams.map(team => (
                    <tr key={team.id} className="hover:bg-emerald-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.subRegionName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{team.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{team.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{team.admin[0]}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {team.Officers || "no market"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'markets':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-emerald-800">Markets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Market Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Referral Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Users</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {markets.map(market => (
                    <tr key={market.id} className="hover:bg-emerald-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{market.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{market.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-2 py-1 text-sm bg-gray-100 rounded text-emerald-700">{market.referralCode}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{market.marketAdmin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {market.users} Users
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'onboarding-chain':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-emerald-800">Onboarding Chain Tracking</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Referral Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Date Onboarded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Referred By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Referred Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {onboardingChain.map(user => (
                    <tr key={user.id} className="hover:bg-emerald-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-2 py-1 text-sm bg-gray-100 rounded text-emerald-700">{user.code}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {user.referredBy === 'Direct' ? (
                          <span className="text-gray-500">Direct Signup</span>
                        ) : (
                          <span className="text-emerald-600">{user.referredBy}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {user.referredCount} Users
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />

      {/* Main layout container */}
      <div className="flex pt-16">
        {/* Sidebar with fixed positioning */}
        <div className="fixed left-0 top-5 h-[calc(100vh-4rem)] z-30">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 ml-72 p-6">
          {/* Header with role selector and title */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-emerald-900">Branch Management System</h1>
                <p className="text-gray-600 mt-2">Hierarchical organization management with referral tracking</p>
              </div>

              {/* Role selector */}
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-lg shadow-sm p-2 border border-emerald-100">
                  <span className="text-sm font-medium text-gray-700 mr-2">Current Task:</span>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="bg-white border border-emerald-200 rounded-lg px-3 py-1 text-emerald-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="region-admin">Create team</option>
                    <option value="team-leader">Team Leader</option>
                  </select>
                </div>

                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-medium">
                  {userRole === 'superadmin' && 'Create Regions'}
                  {userRole === 'region-admin' && 'Create Teams'}
                  {userRole === 'team-leader' && activeTab === 'create' ? 'Create Markets' : 'Onboard Users'}
                </div>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="flex space-x-1 mt-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-t-lg font-medium transition duration-200 ${activeTab === 'create'
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-gray-200'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
              >
                {userRole === 'superadmin' && 'Create Region'}
                {userRole === 'region-admin' && 'Create Team'}
                {userRole === 'team-leader' && 'Create Market'}
              </button>

              {userRole === 'team-leader' && (
                <button
                  onClick={() => { setActiveTab('onboard'); setViewType('onboarding-chain') }}
                  className={`px-4 py-2 rounded-t-lg font-medium transition duration-200 ${activeTab === 'onboard'
                    ? 'bg-white text-emerald-700 border-t border-l border-r border-gray-200'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                >
                  Onboard Users
                </button>
              )}

              <button
                onClick={() => setViewType('regions')}
                className={`px-4 py-2 rounded-t-lg font-medium transition duration-200 ${viewType === 'regions'
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-gray-200'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
              >
                View Regions
              </button>

              <button
                onClick={() => setViewType('teams')}
                className={`px-4 py-2 rounded-t-lg font-medium transition duration-200 ${viewType === 'teams'
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-gray-200'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
              >
                View Teams
              </button>

              <button
                onClick={() => setViewType('markets')}
                className={`px-4 py-2 rounded-t-lg font-medium transition duration-200 ${viewType === 'markets'
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-gray-200'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
              >
                View Markets
              </button>

              <button
                onClick={() => setViewType('onboarding-chain')}
                className={`px-4 py-2 rounded-t-lg font-medium transition duration-200 ${viewType === 'onboarding-chain'
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-gray-200'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
              >
                Onboarding Chain
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="grid grid-cols-1 gap-8">
            {/* Form section */}
            {(activeTab === 'create' || (userRole === 'team-leader' && activeTab === 'onboard')) && (
              <div className="animate-fadeIn">
                {renderForm()}
              </div>
            )}

            {/* Data table section */}
            {viewType && (
              <div className="animate-fadeIn">
                {renderDataTable()}
              </div>
            )}

            {/* Statistics summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-emerald-100 mr-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Regions</p>
                    <p className="text-2xl font-bold text-emerald-800">{mockRegions.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-emerald-100 mr-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Teams</p>
                    <p className="text-2xl font-bold text-emerald-800">{teams.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-emerald-100 mr-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Markets</p>
                    <p className="text-2xl font-bold text-emerald-800">{markets.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-emerald-100 mr-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.66 0-1.293-.103-1.897-.298M12 4.354A4 4 0 0010 1a9 9 0 00-4 17m6-18s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1m6 0V9"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-emerald-800">{onboardingChain.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default BranchManagement;