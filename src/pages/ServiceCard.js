import React from 'react';
import { Calendar, ChevronDown, Menu, Moon, Bell, Circle, MoreHorizontal } from 'lucide-react';

const DatumDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-56 bg-blue-900 text-white">
        {/* Logo */}
        <div className="p-4 flex items-center">
          <Circle className="mr-2 fill-white stroke-blue-900" />
          <span className="font-bold text-xl">Datum</span>
        </div>
        
        {/* Sidebar Menu */}
        <div className="mt-4">
          <div className="px-4 py-2 text-xs text-gray-400">APPLICATION</div>
          
          <div className="px-4 py-2 flex items-center bg-blue-800 rounded-r-lg">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Dashboard</span>
            <div className="bg-blue-600 ml-auto rounded-full w-6 h-6 flex items-center justify-center text-xs">6</div>
          </div>
          
          <div className="px-4 py-2 flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Customer</span>
          </div>
          
          <div className="px-4 py-2 flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Product</span>
          </div>
          
          <div className="px-4 py-2 flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Order</span>
          </div>
          
          <div className="px-4 py-2 flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Invoice</span>
          </div>
          
          {/* More menu items... */}
          <div className="px-4 py-2 flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H15M12 8V14M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Todo</span>
          </div>
          
          <div className="px-4 py-2 flex items-center">
            <Calendar className="w-5 h-5 mr-3" />
            <span>Calendar</span>
            <div className="ml-auto bg-green-500 text-xs rounded px-1">New</div>
          </div>
          
          <div className="px-4 py-2 mt-2 text-xs text-gray-400">PAGES</div>
          {/* More sections... */}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Menu className="mr-2 text-gray-500" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Moon className="text-gray-500" />
                <div className="mx-2 w-10 h-5 bg-gray-200 rounded-full flex items-center p-1">
                  <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <Bell className="text-gray-500" />
              <div className="flex items-center">
                <img src="/api/placeholder/24/24" alt="US Flag" className="w-6 h-6 rounded-full object-cover" />
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </div>
              <div className="flex items-center">
                <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full object-cover" />
                <div className="ml-2">
                  <div className="text-sm font-medium">John Doe</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Overview</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">From Date</span>
                <div className="bg-white p-2 rounded flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">To</span>
                <span className="text-sm text-gray-500 mr-2">To Date</span>
                <div className="bg-white p-2 rounded flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 mb-2">Total Profit</div>
              <div className="text-2xl font-bold">$95,595</div>
              <div className="text-green-500">+3.55%</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 mb-2">Total Expenses</div>
              <div className="text-2xl font-bold">$12,789</div>
              <div className="text-green-500">+2.67%</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 mb-2">New Users</div>
              <div className="text-2xl font-bold">13,984</div>
              <div className="text-red-500">-9.98%</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-lg font-semibold mb-4">Top Selling Product</div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs">🎧</span>
                    </div>
                    <div>Rockerz Bluetooth Headset</div>
                  </div>
                  <div className="font-semibold">$1,056</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs">📷</span>
                    </div>
                    <div>Wifi Security Camera</div>
                  </div>
                  <div className="font-semibold">$1,799</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs">🔊</span>
                    </div>
                    <div>Stone Bluetooth Speaker</div>
                  </div>
                  <div className="font-semibold">$1,099</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs">💻</span>
                    </div>
                    <div>Ryzen 5 Hexa Core 5600H</div>
                  </div>
                  <div className="font-semibold">$9,999</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart and Progress */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Sales Report</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-900 rounded-sm mr-1"></div>
                    <span className="text-xs">Incomes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                    <span className="text-xs">Expenses</span>
                  </div>
                </div>
              </div>
              
              {/* Placeholder for the chart */}
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-32">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    <path d="M0 80 C50 30, 100 90, 150 50 C200 20, 250 60, 300 40 C350 20, 400 60, 450 80" fill="none" stroke="#4F46E5" strokeWidth="3" />
                    <path d="M0 70 C50 90, 100 50, 150 70 C200 90, 250 50, 300 70 C350 90, 400 30, 450 70" fill="none" stroke="#1E3A8A" strokeWidth="3" />
                  </svg>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 text-xs text-gray-500">
                  <span>00:00</span>
                  <span>01:00</span>
                  <span>02:00</span>
                  <span>03:00</span>
                  <span>04:00</span>
                  <span>05:00</span>
                  <span>06:00</span>
                </div>
                
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4 text-xs text-gray-500">
                  <span>150</span>
                  <span>120</span>
                  <span>90</span>
                  <span>60</span>
                  <span>30</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-500 p-6 rounded-lg shadow-sm text-white">
              <div className="flex">
                <div className="flex-1">
                  <div className="text-xl font-bold mb-2">1,860</div>
                  <div className="text-sm text-blue-100">/3k Target</div>
                  <div className="text-sm text-blue-100">Order in Period</div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg viewBox="0 0 36 36" className="w-16 h-16">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="4" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="62, 100" />
                    <text x="18" y="20.5" textAnchor="middle" fill="white" fontSize="8">62%</text>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Upcoming Events</h2>
                </div>
                <MoreHorizontal className="text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 text-blue-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">30 JUN, TUE</div>
                    <div>Big Billion Day Sale</div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-blue-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">09 JULY, MON</div>
                    <div>5% Off on Mobile</div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-blue-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">15 AUG, SUN</div>
                    <div>Electronics Sale</div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-blue-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">26 OCT, THU</div>
                    <div>Fashionable Sale</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">Popular Categories</h2>
                
                <div className="w-36 h-36 relative">
                  <svg viewBox="0 0 36 36" className="w-36 h-36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FFC107" strokeWidth="4" strokeDasharray="40, 100" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1E3A8A" strokeWidth="4" strokeDasharray="30, 100" strokeDashoffset="-40" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#818CF8" strokeWidth="4" strokeDasharray="20, 100" strokeDashoffset="-70" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="10, 100" strokeDashoffset="-90" />
                    <text x="18" y="18" textAnchor="middle" fill="gray" fontSize="10">Total</text>
                    <text x="18" y="24" textAnchor="middle" fill="gray" fontSize="14" fontWeight="bold">156</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DatumDashboard;