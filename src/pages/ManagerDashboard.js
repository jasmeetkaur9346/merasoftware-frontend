import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';

const ManagerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [banners, setBanners] = useState([]);
  const [activeBannersCount, setActiveBannersCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await fetch(SummaryApi.getAllProducts.url, {
        credentials: 'include', // Include cookies for authentication
      });
      const data = await response.json();
      const allProducts = data?.data || [];
      setProducts(allProducts);

      const activeProducts = allProducts.filter(product => !product.isHidden);
      const hiddenProducts = allProducts.filter(product => product.isHidden);

      setActiveCount(activeProducts.length);
      setHiddenCount(hiddenProducts.length);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch(SummaryApi.allBanner.url, {
        credentials: 'include',
      });
      const data = await response.json();
      const allBanners = data?.data || [];
      setBanners(allBanners);

      const activeBanners = allBanners.filter(banner => banner.isActive);
      setActiveBannersCount(activeBanners.length);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBanners();
  }, []);

  const totalProducts = products.length;
  const totalBanners = banners.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back to your CRM dashboard</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Active Products */}
        <div className="bg-blue-500 text-white rounded-lg p-6 shadow-md flex flex-col justify-between">
          <div className="text-lg font-medium">Active Products</div>
          <div className="text-3xl font-bold mt-4">{activeCount}/{totalProducts}</div>
        </div>

        {/* Hidden Products */}
        <div className="bg-green-500 text-white rounded-lg p-6 shadow-md flex flex-col justify-between">
          <div className="text-lg font-medium">Hidden Products</div>
          <div className="text-3xl font-bold mt-4">{hiddenCount}/{totalProducts}</div>
        </div>

        {/* Active Welcome Content */}
        {/* <div className="bg-purple-600 text-white rounded-lg p-6 shadow-md flex flex-col justify-between">
          <div className="text-lg font-medium">Active Welcome Content</div>
          <div className="text-3xl font-bold mt-4">0/0</div>
        </div> */}

        {/* Active Ads */}
        <div className="bg-yellow-500 text-white rounded-lg p-6 shadow-md flex flex-col justify-between">
          <div className="text-lg font-medium">Active Ads</div>
          <div className="text-3xl font-bold mt-4">{activeBannersCount}/{totalBanners}</div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
