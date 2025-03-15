import React, { useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import { FaAngleLeft, FaAngleRight, FaLongArrowAltRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useOnlineStatus } from '../App';
import StorageService from '../utils/storageService';

const VerticalCardProduct = ({category, heading}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(8).fill(null);
    const scrollElement = useRef();
    const { isOnline, isInitialized } = useOnlineStatus();

    // Updated color styles to match the requirement
    const colorStyles = {
        'static_websites': {
            bg: "bg-white",
            border: "border-emerald-100",
            text: "text-emerald-950",
            textSecondary: "text-emerald-600",
            headingColor: "#009688",
            headerBg: "bg-blue-500", // Updated to match image
            button: "bg-emerald-600",
            tagBg: "bg-white text-emerald-600 border-emerald-100"
        },
        'standard_websites': {
            bg: "bg-white",
            border: "border-blue-100",
            text: "text-blue-950",
            textSecondary: "text-blue-600",
            headingColor: "#2196f3",
            headerBg: "bg-blue-500", // Blue ribbon for standard websites
            button: "bg-blue-600",
            tagBg: "bg-white text-blue-600 border-indigo-100"
        },
        'dynamic_websites': {
            bg: "bg-white",
            border: "border-green-100",
            text: "text-green-950",
            textSecondary: "#009688",
            headingColor: "#009688",
            headerBg: "bg-blue-500", // Updated to match image
            button: "bg-green-600",
            tagBg: "bg-white text-green-600 border-green-100"
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
          if (!isInitialized) return;
          
          // First check localStorage
          const cachedProducts = StorageService.getProductsData(category);
          if (cachedProducts) {
            const sortedData = cachedProducts.sort((a, b) => 
              a.serviceName.localeCompare(b.serviceName)
            );
            setData(sortedData);
            setLoading(false);
          }
      
          // If online, fetch fresh data
          if (isOnline) {
            try {
              const response = await fetchCategoryWiseProduct(category);
              if (response?.data) {
                const sortedData = response.data.sort((a, b) => 
                  a.serviceName.localeCompare(b.serviceName)
                );
                StorageService.setProductsData(category, sortedData);
                setData(sortedData);
              }
            } catch (error) {
              console.error('Error fetching products:', error);
            } finally {
              setLoading(false);
            }
          }
        };
      
        loadProducts();
    }, [category, isInitialized, isOnline]);

    const getColorStyle = (productCategory) => {
        return colorStyles[productCategory] || colorStyles.standard_websites;
    };

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 300;
    };

    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 300;
    };

    return (
        <div className='container mx-auto md:px-14 px-4 my-1 mb-6 relative'>
            <div className="flex justify-between items-center mb-6">
                <h2 className='text-2xl font-bold'>{heading}</h2>
                <Link 
                    to={`/product-category?category=${category}`}
                    className="text-blue-600 hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className='relative'>
                <button 
                    className='absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden md:block text-gray-700 hover:bg-gray-100' 
                    onClick={scrollLeft}
                >
                    <FaAngleLeft size={24} />
                </button>
                
                <div className='flex gap-5 overflow-x-scroll scrollbar-none transition-all' ref={scrollElement}>
                    {loading ? (
                        loadingList.map((_, index) => (
                                                            <div key={index} className="flex-none w-full max-w-[280px] min-w-[280px] border rounded-lg overflow-hidden shadow-md bg-white">
                                {/* Loading state - top header */}
                                <div className="h-10 bg-white border-b animate-pulse">
                                    <div className="h-5 w-3/4 mx-auto mt-2 bg-slate-200 rounded animate-pulse"></div>
                                </div>
                                
                                {/* Loading state - image */}
                                <div className="h-36 bg-slate-200 animate-pulse"></div>
                                
                                {/* Loading state - content */}
                                <div className="p-4 space-y-2">
                                    <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
                                        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                                    </div>
                                    <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        data.map((product) => {
                            const style = getColorStyle(product?.category);
                            
                            return (
                                <div 
                                    key={product?._id} 
                                    className="flex-none w-full max-w-[320px] min-w-[280px] border rounded-lg overflow-hidden shadow-md bg-white"
                                >
                                    {/* Service Name Header - No background color, just colored text */}
                                    <div className="ml-4 font-bold line-clamp-1 overflow-hidden py-2.5 text-[17px] border-b" style={{ color: style.headingColor }}>
                                        {product?.serviceName.toUpperCase()}
                                    </div>
                                    
                                    {/* Website Preview Image */}
                                    <Link to={`product/${product?._id}`}>
                                        <div className="overflow-hidden">
                                            <img 
                                                src={product?.serviceImage[0]} 
                                                alt={product?.serviceName}
                                                className="w-full h-28 object-cover object-top hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    </Link>
                                    
                                    {/* Service Name (without colored text since it's already in the header) */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-xl  mb-3 line-clamp-1 overflow-hidden">
                                            {product?.serviceName}
                                        </h3>
                                        
                                        {/* Features list */}
                                        <ul className="space-y-1.5 my-3">
                                            {product?.packageIncludes?.slice(0, 2).map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="text-red-500 mr-2">•</span>
                                                    <span className=" capitalize">{feature}</span>
                                                </li>
                                            ))}
                                            {product?.packageIncludes?.length > 2 && (
                                                <li className="flex items-start">
                                                    <span className="text-red-500 mr-2">•</span>
                                                    <span className="text-sm">+ {product.packageIncludes.length - 2} more</span>
                                                </li>
                                            )}
                                        </ul>
                                        
                                        {/* Customize button with color matching the category */}
                                        <button 
                                            className="w-full py-2 rounded font-medium text-white text-center transition-colors"
                                            style={{ backgroundColor: style.headingColor }}
                                        >
                                            Customize Plan
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                
                <button 
                    className='absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden md:block text-gray-700 hover:bg-gray-100' 
                    onClick={scrollRight}
                >
                    <FaAngleRight size={24} />
                </button>
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center mt-4 gap-1">
                {Array.from({ length: Math.max(1, Math.ceil(data.length / 3)) }).map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                        onClick={() => scrollElement.current.scrollLeft = idx * 300}
                    />
                ))}
            </div>
        </div>
    );
};

export default VerticalCardProduct;