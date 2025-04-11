import React, { useState } from 'react';

const BranchManagementCRM = () => {
  // Sample data for three branches
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'Branch A',
      manager: { id: 101, name: 'John Smith', totalComplaints: 23 },
      technicians: [
        { id: 201, name: 'Alex Wilson', assignedComplaints: 5, status: 'busy' },
        { id: 202, name: 'Emma Davis', assignedComplaints: 3, status: 'busy' },
        { id: 203, name: 'Ryan Miller', assignedComplaints: 0, status: 'free' },
        { id: 204, name: 'Sophie Brown', assignedComplaints: 4, status: 'busy' }
      ],
      complaints: [
        { id: 301, title: 'Network Issue', status: 'assigned', technicianId: 201 },
        { id: 302, title: 'Hardware Failure', status: 'assigned', technicianId: 202 },
        { id: 303, title: 'Software Bug', status: 'assigned', technicianId: 201 },
        { id: 304, title: 'Printer Not Working', status: 'assigned', technicianId: 204 },
        { id: 305, title: 'Email Configuration', status: 'assigned', technicianId: 201 },
        { id: 306, title: 'Internet Connectivity', status: 'assigned', technicianId: 202 },
        { id: 307, title: 'Data Recovery', status: 'assigned', technicianId: 201 },
        { id: 308, title: 'System Upgrade', status: 'assigned', technicianId: 204 },
        { id: 309, title: 'VPN Access', status: 'assigned', technicianId: 202 },
        { id: 310, title: 'Account Lockout', status: 'assigned', technicianId: 201 },
        { id: 311, title: 'Display Issues', status: 'assigned', technicianId: 204 },
        { id: 312, title: 'Password Reset', status: 'unassigned', technicianId: null }
      ]
    },
    {
      id: 2,
      name: 'Branch B',
      manager: { id: 102, name: 'Sarah Johnson', totalComplaints: 18 },
      technicians: [
        { id: 205, name: 'James Taylor', assignedComplaints: 4, status: 'busy' },
        { id: 206, name: 'Olivia White', assignedComplaints: 3, status: 'busy' },
        { id: 207, name: 'Daniel Clark', assignedComplaints: 3, status: 'busy' },
        { id: 208, name: 'Lily Martin', assignedComplaints: 0, status: 'free' }
      ],
      complaints: [
        { id: 313, title: 'Server Down', status: 'assigned', technicianId: 205 },
        { id: 314, title: 'Database Error', status: 'assigned', technicianId: 206 },
        { id: 315, title: 'Backup Failure', status: 'assigned', technicianId: 207 },
        { id: 316, title: 'Laptop Repair', status: 'assigned', technicianId: 205 },
        { id: 317, title: 'Monitor Flickering', status: 'assigned', technicianId: 206 },
        { id: 318, title: 'Keyboard Not Working', status: 'assigned', technicianId: 207 },
        { id: 319, title: 'Software Installation', status: 'assigned', technicianId: 205 },
        { id: 320, title: 'Virus Removal', status: 'assigned', technicianId: 206 },
        { id: 321, title: 'WiFi Configuration', status: 'assigned', technicianId: 207 },
        { id: 322, title: 'File Sharing Issue', status: 'assigned', technicianId: 205 }
      ]
    },
    {
      id: 3,
      name: 'Branch C',
      manager: { id: 103, name: 'Michael Chen', totalComplaints: 15 },
      technicians: [
        { id: 209, name: 'Emily Harris', assignedComplaints: 3, status: 'busy' },
        { id: 210, name: 'Noah Walker', assignedComplaints: 4, status: 'busy' },
        { id: 211, name: 'Ava Thompson', assignedComplaints: 0, status: 'free' },
        { id: 212, name: 'Ethan Roberts', assignedComplaints: 0, status: 'free' },
        { id: 213, name: 'Isabella Turner', assignedComplaints: 2, status: 'busy' }
      ],
      complaints: [
        { id: 323, title: 'Slow Computer', status: 'assigned', technicianId: 209 },
        { id: 324, title: 'Website Access', status: 'assigned', technicianId: 210 },
        { id: 325, title: 'Email Not Sending', status: 'assigned', technicianId: 209 },
        { id: 326, title: 'Headset Not Working', status: 'assigned', technicianId: 210 },
        { id: 327, title: 'Mobile App Issues', status: 'assigned', technicianId: 213 },
        { id: 328, title: 'Data Analysis Tool', status: 'assigned', technicianId: 209 },
        { id: 329, title: 'Video Conference Setup', status: 'assigned', technicianId: 210 },
        { id: 330, title: 'Cloud Storage Problem', status: 'assigned', technicianId: 213 },
        { id: 331, title: 'Software License', status: 'assigned', technicianId: 210 }
      ]
    }
  ]);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Selecting a branch to view details
  const handleBranchSelect = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    setSelectedBranch(branch);
    setActiveTab('overview');
  };

  // Function to count free technicians
  const countFreeTechnicians = (technicians) => {
    return technicians.filter(tech => tech.status === 'free').length;
  };

  // Function to count unassigned complaints
  const countUnassignedComplaints = (complaints) => {
    return complaints.filter(complaint => complaint.status === 'unassigned').length;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Branch Management CRM</h1>
          <p className="text-sm">Admin Dashboard</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Sidebar for Branch List */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Branches</h2>
          <ul>
            {branches.map(branch => (
              <li key={branch.id} className="mb-2">
                <button
                  onClick={() => handleBranchSelect(branch.id)}
                  className={`w-full text-left p-3 rounded-md transition ${
                    selectedBranch && selectedBranch.id === branch.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{branch.name}</div>
                  <div className="text-sm text-gray-600">
                    Manager: {branch.manager.name}
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Complaints: {branch.complaints.length}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Free Techs: {countFreeTechnicians(branch.technicians)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-4">
          {selectedBranch ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedBranch.name}</h2>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Manager: {selectedBranch.manager.name}
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 px-1 ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('technicians')}
                    className={`pb-2 px-1 ${
                      activeTab === 'technicians'
                        ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Technicians
                  </button>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`pb-2 px-1 ${
                      activeTab === 'complaints'
                        ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Complaints
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Total Complaints</h3>
                      <p className="text-3xl font-bold text-blue-600">{selectedBranch.complaints.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-green-800 mb-2">Available Technicians</h3>
                      <p className="text-3xl font-bold text-green-600">
                        {countFreeTechnicians(selectedBranch.technicians)} / {selectedBranch.technicians.length}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-yellow-800 mb-2">Unassigned Complaints</h3>
                      <p className="text-3xl font-bold text-yellow-600">
                        {countUnassignedComplaints(selectedBranch.complaints)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Branch Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-2">
                        <span className="font-medium">Manager:</span> {selectedBranch.manager.name}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Total Technicians:</span> {selectedBranch.technicians.length}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Active Complaints:</span> {selectedBranch.complaints.length}
                      </p>
                      <p>
                        <span className="font-medium">Complaint Resolution Rate:</span> 87%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-gray-600">Today, 10:25 AM</p>
                        <p className="font-medium">New complaint assigned to Alex Wilson</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-400">
                        <p className="text-sm text-gray-600">Today, 09:15 AM</p>
                        <p className="font-medium">Complaint #304 resolved by Sophie Brown</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-sm text-gray-600">Yesterday, 04:30 PM</p>
                        <p className="font-medium">New complaint received: Password Reset</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technicians' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Technicians</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Assigned Complaints</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedBranch.technicians.map(tech => (
                          <tr key={tech.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">{tech.name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tech.status === 'free' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {tech.status === 'free' ? 'Available' : 'Busy'}
                              </span>
                            </td>
                            <td className="py-3 px-4">{tech.assignedComplaints}</td>
                            <td className="py-3 px-4">
                              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                                View
                              </button>
                              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                Assign
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'complaints' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Complaints</h3>
                    <div className="flex space-x-2">
                      <select className="border rounded-md px-3 py-1">
                        <option>All Complaints</option>
                        <option>Assigned</option>
                        <option>Unassigned</option>
                        <option>Resolved</option>
                      </select>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        New Complaint
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">ID</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Title</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Assigned To</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedBranch.complaints.map(complaint => {
                          const assignedTech = selectedBranch.technicians.find(
                            tech => tech.id === complaint.technicianId
                          );
                          
                          return (
                            <tr key={complaint.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">#{complaint.id}</td>
                              <td className="py-3 px-4">{complaint.title}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  complaint.status === 'assigned' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {complaint.status === 'assigned' ? 'Assigned' : 'Unassigned'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {assignedTech ? assignedTech.name : 'Not assigned'}
                              </td>
                              <td className="py-3 px-4">
                                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                                  View
                                </button>
                                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                  Update
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <svg 
                className="w-16 h-16 mx-auto text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">Select a branch to view details</h3>
              <p className="text-gray-400 mt-2">Branch information will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchManagementCRM;