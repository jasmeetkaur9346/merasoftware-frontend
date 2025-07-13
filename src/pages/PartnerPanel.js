import React, { useEffect, useState } from "react";
import { FaRegCircleUser, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import {
  MdDashboard,
  MdAdminPanelSettings,
  MdShoppingCart,
  MdPeople,
  MdWeb,
  MdBusiness,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";

const PartnerPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  // State for collapsible sections - only one can be open at a time
  const [openSection, setOpenSection] = useState(null);

 useEffect(() => {
            // Assuming user.roles is an array of strings
            if (!user?.roles?.includes(ROLE.PARTNER)) { 
                navigate("/");
            }
        }, [user, navigate]);

  const toggleSection = (section) => {
    // If clicking on already open section, close it. Otherwise open the new section
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="min-h-[calc(100vh-100px)] md:flex hidden">
      <aside className="bg-slate-800 min-h-full w-full max-w-60 text-white overflow-y-auto">
        {/* User Profile Section */}
        <div className="h-32 flex justify-center items-center flex-col border-b border-slate-700">
          <div className="text-4xl cursor-pointer relative flex justify-center mb-2">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-16 h-16 rounded-full border-2 border-blue-500"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser className="text-gray-300" />
            )}
          </div>
          <p className=" text-xl font-semibold text-white">{user?.name}</p>
          <p className="text-sm capitalize text-gray-400">{user?.role}</p>
        </div>

        {/* Navigation */}
        <div className="p-2">
          <nav className="space-y-1">
            {/* Dashboard */}
            <Link
              to={""}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <MdDashboard className="mr-3 text-lg" />
              Dashboard
            </Link>

            <Link
              to={"partner-customers"}
              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
            >
              <MdPeople className="mr-3 text-lg" />
              My Customers
            </Link>

            <Link
              to={"business-created"}
              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
            >
              <MdBusiness className="mr-3 text-lg" />
              Business Created
            </Link>

            <Link
              to={"first-purchase-list"}
              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
            >
              {/* You can choose an icon here, using MdShoppingCart as example */}
              <MdShoppingCart className="mr-3 text-lg" />
              First Purchase
            </Link>

          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default PartnerPanel;
