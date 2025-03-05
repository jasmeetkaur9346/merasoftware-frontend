import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import StorageService from '../utils/storageService';

const VerticalCard = ({ loading: initialLoading, data: initialData = [], currentCategory = '' }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const loadingList = new Array(6).fill(null);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(initialLoading);
    const [data, setData] = useState([]);
    const [isDataFromCache, setIsDataFromCache] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortOption, setSortOption] = useState('default');

    // Format category name from URL format to display format
    const formatCategoryName = useCallback((categoryValue) => {
        return categoryValue.split('_').join(' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, []);

    // Get unique categories from URL
    const uniqueCategories = useMemo(() => {
        const categoriesFromURL = queryParams.getAll('category');
        if (categoriesFromURL.length > 0) {
            const formattedCategories = categoriesFromURL.map(cat => formatCategoryName(cat));
            return ['All', ...formattedCategories];
        }
        return ['All'];
    }, [queryParams, formatCategoryName]);

    // Load initial data - only runs once on mount or when initialData/currentCategory changes
    useEffect(() => {
        const loadData = async () => {
            if (initialData && initialData.length > 0) {
                setData(initialData);
                setLoading(false);
            } else {
                const cachedProducts = StorageService.getProductsData(currentCategory);
                
                if (cachedProducts && cachedProducts.length > 0) {
                    console.log('Using cached products data');
                    setData(cachedProducts);
                    setIsDataFromCache(true);
                    setLoading(false);
                }
            }
        };
        
        loadData();
    }, [initialData, currentCategory]);

    // Fetch banners - only runs once on mount or when currentCategory changes
    useEffect(() => {
        const fetchBanners = async () => {
            const cachedBanners = StorageService.getProductBanners(currentCategory);
            
            if (cachedBanners) {
                console.log('Using cached banners data');
                setBanners(cachedBanners);
                return;
            }
            
            try {
                const response = await fetch(SummaryApi.allBanner.url);
                const responseData = await response.json();
                if (responseData.success && responseData.data) {
                    const categoryBanners = responseData.data.filter(banner => 
                        banner.isActive && 
                        banner.position === currentCategory
                    );
                    
                    const groupedBanners = {};
                    categoryBanners.forEach(banner => {
                        if (!groupedBanners[banner.displayOrder]) {
                            groupedBanners[banner.displayOrder] = [];
                        }
                        groupedBanners[banner.displayOrder].push(banner);
                    });
                    
                    // Shuffle banners in groups where there are multiple banners
                    Object.keys(groupedBanners).forEach(order => {
                        if (groupedBanners[order].length > 1) {
                            const newArray = [...groupedBanners[order]];
                            for (let i = newArray.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
                            }
                            groupedBanners[order] = newArray;
                        }
                    });

                    setBanners(groupedBanners);
                    StorageService.setProductBanners(currentCategory, groupedBanners);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
        
        // Set up banner rotation interval
        const intervalId = setInterval(() => {
            setBanners(prevBanners => {
                const newBanners = { ...prevBanners };
                Object.keys(newBanners).forEach(order => {
                    if (newBanners[order] && newBanners[order].length > 1) {
                        const newArray = [...newBanners[order]];
                        for (let i = newArray.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
                        }
                        newBanners[order] = newArray;
                    }
                });
                return newBanners;
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentCategory]);

    // Apply filter and sort using useMemo instead of useEffect
    const filteredAndSortedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        let result = [...data];
        
        // First apply the category filter
        if (activeFilter !== 'All') {
            // Convert activeFilter back to URL format for comparison
            const activeFilterURLFormat = activeFilter.toLowerCase().split(' ').join('_');
            
            result = result.filter(product => 
                product.category && product.category.toLowerCase() === activeFilterURLFormat
            );
        }
        
        // Then apply sorting
        switch (sortOption) {
            case 'price-low-high':
                result.sort((a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0));
                break;
            case 'price-high-low':
                result.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0));
                break;
            case 'name-a-z':
                result.sort((a, b) => (a.serviceName || '').localeCompare(b.serviceName || ''));
                break;
            case 'name-z-a':
                result.sort((a, b) => (b.serviceName || '').localeCompare(a.serviceName || ''));
                break;
            default:
                // Keep default order
                break;
        }
        
        return result;
    }, [data, activeFilter, sortOption]);

    const getBannerForPosition = useCallback((index) => {
        if (index === -1 && banners['0'] && banners['0'].length > 0) {
            const randomImageIndex = Math.floor(Math.random() * banners['0'][0].images.length);
            return {
                ...banners['0'][0],
                currentImage: banners['0'][0].images[randomImageIndex]
            };
        }

        const orderKey = (index + 1).toString();
        if (banners[orderKey] && banners[orderKey].length > 0) {
            const randomImageIndex = Math.floor(Math.random() * banners[orderKey][0].images.length);
            return {
                ...banners[orderKey][0],
                currentImage: banners[orderKey][0].images[randomImageIndex]
            };
        }

        return null;
    }, [banners]);

    // Filter Button Component
    const FilterButton = ({ title, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                isActive 
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
        >
            {title}
        </button>
    );

    const getIconColor = (category) => {
        if (!category) return 'text-blue-500';
        
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('standard')) {
          return 'text-blue-500'; // Standard Websites के लिए नीला
        } else if (categoryLower.includes('dynamic')) {
          return 'text-purple-500'; // Dynamic Websites के लिए बैंगनी
        } else if (categoryLower.includes('app')) {
          return 'text-green-500'; // App Development के लिए हरा
        } else if (categoryLower.includes('update') || categoryLower.includes('upgrade')) {
          return 'text-amber-500'; // Updates/Upgrades के लिए एम्बर
        }
        return 'text-blue-500'; // डिफॉल्ट कलर
    };

    // Loading state
    if (loading && (!data || data.length === 0) && !isDataFromCache) {
        return (
            <div className="px-2 pb-4 mb-28">
                {/* Header and filter skeleton */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 animate-pulse">
                    <div className="flex space-x-2 mb-4 md:mb-0">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-8 w-40 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-40 bg-gray-200 rounded"></div>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {loadingList.map((_, index) => (
                        <div key={index} className='w-full bg-white rounded-lg shadow-sm p-0 border border-gray-200'>
                            <div className='flex flex-col sm:flex-row'>
                                <div className='sm:w-2/5 bg-slate-200 h-40 animate-pulse'></div>
                                <div className='p-4 sm:w-3/5'>
                                    <div className='animate-pulse rounded-full bg-slate-200 h-6 w-3/4 mb-2'></div>
                                    <div className='animate-pulse rounded-full bg-slate-200 h-4 w-1/2 mb-4'></div>
                                    <div className='space-y-2'>
                                        <div className='animate-pulse rounded-full bg-slate-200 h-4 w-full'></div>
                                        <div className='animate-pulse rounded-full bg-slate-200 h-4 w-full'></div>
                                    </div>
                                    <div className='animate-pulse rounded-lg bg-slate-200 h-10 w-full mt-4'></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Product card component - Horizontal style
    const ProductCard = ({ product }) => {
        // Display only first 4 features
        const displayFeatures = product?.packageIncludes?.slice(0, 4) || [];
        const hasMoreFeatures = product?.packageIncludes?.length > 4;
        
        const discount = product.price && product.sellingPrice 
            ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
            : 0;
        
        return (
            <Link to={"/product/"+product?._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col sm:flex-row h-full">
                {/* Left Section */}
                <div className="px-4 py-4 pt-6 sm:w-[200px] bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product?.serviceName}</h3>
                    <p className="text-sm text-gray-500 mb-4 capitalize">{product?.category?.split('_').join(' ')}</p>
                    
                    {/* Price Section */}
                    <div className="mb-4">
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">₹{(product?.sellingPrice || 15999).toLocaleString()}</span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                                ₹{(product?.price || 34000).toLocaleString()}
                            </span>
                        </div>
                        
                        {discount > 0 && (
                            <div className="mt-1">
                                <span className="text-sm font-medium text-green-600">
                                    Save {discount}% today
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Right Section */}
                <div className="px-4 pt-6 py-4 border-t sm:border-t-0 sm:border-l border-gray-200 sm:w-3/5">
                    <p className="text-sm font-medium text-gray-700 mb-3">Package Features:</p>
                    <ul className="text-sm space-y-2 mb-4">
                        {displayFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <svg className={`h-5 w-5 ${getIconColor(product?.category)} mr-2 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-600 capitalize">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Show More button that redirects to product page */}
                    {hasMoreFeatures && (
                        <p className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors cursor-pointer">
                            Show More Features
                        </p>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div className="px-2 pb-4 mb-28 mt-8">
            {/* Header with filter buttons and sorting options */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                {/* Filter Buttons */}
                <div className="flex space-x-2 flex-wrap mb-4 md:mb-0">
                    {uniqueCategories.map(category => (
                        <FilterButton 
                            key={category}
                            title={category} 
                            isActive={activeFilter === category}
                            onClick={() => setActiveFilter(category)}
                        />
                    ))}
                </div>

                {/* Sorting Dropdown */}
                <div className="relative inline-block">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="default">Sort By</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="name-a-z">Name: A to Z</option>
                        <option value="name-z-a">Name: Z to A</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Show top banner */}
            {getBannerForPosition(-1) && (
                <div 
                    className={`h-auto w-full bg-slate-200 relative rounded-lg mb-6 ${getBannerForPosition(-1).targetUrl ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                        const banner = getBannerForPosition(-1);
                        if (banner.targetUrl) {
                            window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
                        }
                    }}
                >
                    <div className="hidden md:flex h-full w-full overflow-hidden">
                        <div className='w-full h-full min-h-full min-w-full'>
                            <img 
                                src={getBannerForPosition(-1).currentImage}
                                alt="Top Banner"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="flex h-full w-full overflow-hidden md:hidden rounded-lg">
                        <div className='w-full h-full min-h-full min-w-full transition-all'>
                            <img 
                                src={getBannerForPosition(-1).currentImage}
                                alt="Top Banner"
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* No results message */}
            {filteredAndSortedData.length === 0 && !loading && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No packages found for the selected filter.</p>
                </div>
            )}

            {/* Responsive grid for cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedData.map((product, index) => (
                    <React.Fragment key={product._id || index}>
                        <ProductCard product={product} />
                        
                        {/* Show banner after card if exists */}
                        {getBannerForPosition(index) && (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                <div 
                                    className={`h-auto w-full bg-slate-200 relative rounded-lg ${getBannerForPosition(index).targetUrl ? 'cursor-pointer' : ''}`}
                                    onClick={() => {
                                        const banner = getBannerForPosition(index);
                                        if (banner.targetUrl) {
                                            window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
                                        }
                                    }}
                                >
                                    {/* desktop version */}
                                    <div className="hidden md:flex h-full w-full overflow-hidden">
                                        <div className='w-full h-full min-h-full min-w-full'>
                                            <img 
                                                src={getBannerForPosition(index).currentImage}
                                                alt={`Banner after card ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    {/* mobile version */}
                                    <div className="flex h-full w-full overflow-hidden md:hidden rounded-lg">
                                        <div className='w-full h-full min-h-full min-w-full transition-all'>
                                            <img 
                                                src={getBannerForPosition(index).currentImage}
                                                alt={`Banner after card ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default VerticalCard;