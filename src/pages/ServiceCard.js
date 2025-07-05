import React, { useState } from 'react';
// Icons import kar rahe hain
import {
  FaTachometerAlt, FaUserShield, FaBoxOpen, FaUsers, FaGlobe, FaCogs,
  FaChevronDown, FaTicketAlt, FaCreditCard, FaShoppingCart, FaHdd,
  FaHeadset, FaWallet, FaCloud, FaMobileAlt, FaDesktop, FaBullhorn,
  FaImage, FaServer, FaUserCog, FaUserTie, FaUserFriends, FaHandshake
} from 'react-icons/fa';

const Sidebar = () => {
  // 'openSection' state accordion ke liye
  const [openSection, setOpenSection] = useState('Admin Panel'); 
  // 'activeItem' state active link ko highlight karne ke liye
  const [activeItem, setActiveItem] = useState('Dashboard');

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  // Data ko icons ke saath update kiya gaya hai
  const sidebarData = [
    {
      title: 'Admin Panel',
      icon: <FaUserShield />,
      items: [
        { name: 'Coupon Codes', icon: <FaTicketAlt /> },
        { name: 'Payment Verification', icon: <FaCreditCard /> },
        { name: 'Pending Orders', icon: <FaShoppingCart /> },
        { name: 'Storage Settings', icon: <FaHdd /> },
        { name: 'Support Panel', icon: <FaHeadset /> },
        { name: 'Wallet & Payments', icon: <FaWallet /> },
      ],
    },
    {
      title: 'Product Management',
      icon: <FaBoxOpen />,
      items: [
        { name: 'Cloud Apps', icon: <FaCloud /> },
        { name: 'Features', icon: <FaCogs /> },
        { name: 'Mobile Apps', icon: <FaMobileAlt /> },
        { name: 'Websites', icon: <FaDesktop /> },
      ],
    },
    {
      title: 'User Management',
      icon: <FaUsers />,
      items: [
        { name: 'All Admins', icon: <FaUserCog /> },
        { name: 'All Customers', icon: <FaUserFriends /> },
        { name: 'All Developers', icon: <FaUserTie /> },
        { name: 'All Partners', icon: <FaHandshake /> },
      ],
    },
    {
      title: 'Website Management',
      icon: <FaGlobe />,
      items: [
        { name: 'Ad Section', icon: <FaBullhorn /> },
        { name: 'Hero Section', icon: <FaImage /> },
        { name: 'Services', icon: <FaServer /> },
      ],
    },
  ];

  // Sections ko alphabetically sort kiya gaya hai
  const sortedSections = [...sidebarData].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div className="w-72 min-h-screen bg-gray-800 text-gray-300 p-4 flex flex-col">
      {/* Profile Section */}
      <div className="text-center mb-8">
        <img
          src="https://i.pravatar.cc/100?u=sandeep" // Ek random avatar
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-4 border-gray-600"
        />
        <h2 className="mt-4 text-xl font-semibold text-white">Sandeep Singh</h2>
        <p className="text-sm text-gray-400">Administrator</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow">
        {/* Dashboard Link */}
        <a
          href="#"
          onClick={() => setActiveItem('Dashboard')}
          className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
            activeItem === 'Dashboard'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-700'
          }`}
        >
          <FaTachometerAlt className="mr-3" />
          <span className="font-medium">Dashboard</span>
        </a>

        {/* Sidebar Sections */}
        <div className="mt-6 space-y-2">
          {sortedSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-4 py-3 text-left rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
              >
                <div className="flex items-center">
                  <span className="mr-3">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                </div>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${
                    openSection === section.title ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openSection === section.title ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <ul className="mt-2 ml-5 pl-4 border-l-2 border-gray-600 space-y-1">
                  {section.items.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                    <li key={item.name}>
                      <a
                        href="#"
                        onClick={() => setActiveItem(item.name)}
                        className={`flex items-center w-full py-2 px-3 rounded-md transition-colors duration-200 ${
                          activeItem === item.name
                            ? 'text-white font-semibold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="mr-3 text-xs">{item.icon}</span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
