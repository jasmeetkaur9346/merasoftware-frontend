import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageIcon, Check } from 'lucide-react';
import packageOptions from '../helpers/packageOptions';
import perfectForOptions from '../helpers/perfectForOptions';
import SummaryApi from '../common';
import Context from '../context';
import CartPopup from '../components/CartPopup';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import VerticalCardProduct from '../components/VerticalCardProduct';
import addToCart from '../helpers/addToCart';
import QuantitySelector from '../components/QuantitySelector';
import { 
  cacheProductDetails, 
  getCachedProduct, 
  isCacheStale,
  clearOldCache 
} from '../helpers/productDB';

// Alert Modal Component
const AlertModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Notice</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const [data, setData] = useState({
    serviceName: "",
    category: "",
    packageIncludes: [],
    perfectFor: [],
    serviceImage: [],
    price: "",
    sellingPrice: "",
    additionalFeatures: [],
    formattedDescriptions: []
  });

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [additionalFeaturesData, setAdditionalFeaturesData] = useState([]);
  const [quantities, setQuantities] = useState({});

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();
  const params = useParams();

  // Calculate total price including quantities
  const calculateTotalPrice = () => {
    const basePrice = data.sellingPrice;
    const featuresPrice = selectedFeatures.reduce((sum, featureId) => {
      const feature = additionalFeaturesData.find(f => f._id === featureId);
      if (!feature) return sum;

      if (feature.upgradeType === 'component') {
        const quantity = quantities[featureId] || data.totalPages;
        const additionalQuantity = Math.max(0, quantity - data.totalPages);
        return sum + (additionalQuantity * feature.sellingPrice);
      }

      return sum + feature.sellingPrice;
    }, 0);

    return basePrice + featuresPrice;
  };

  // Get icon from packageOptions
  const getIconForFeature = (featureName) => {
    const option = packageOptions.find(opt => 
      opt.value.toLowerCase() === featureName.toLowerCase() ||
      opt.label.toLowerCase() === featureName.toLowerCase()
    );
    return option?.icon || packageOptions[0].icon;
  };

  // Get icon from perfectForOptions
  const getPerfectForIcon = (itemName) => {
    const option = perfectForOptions.find(opt => 
      opt.value.toLowerCase() === itemName.toLowerCase() ||
      opt.label.toLowerCase() === itemName.toLowerCase()
    );
    return option?.icon;
  };

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFeatures.length === additionalFeaturesData.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(additionalFeaturesData.map(f => f._id));
    }
  };

  const handleAddToCart = async (e) => {
    try {
      setAddToCartLoading(true);
      const result = await addToCart(e, data?._id);
      
      if (selectedFeatures.length > 0) {
        await Promise.all(selectedFeatures.map(featureId => {
          const quantity = quantities[featureId] || data.totalPages;
          return addToCart(e, featureId, quantity);
        }));
      }

      await fetchUserAddToCart();
      setAddToCartLoading(false);
      setShowCartPopup(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddToCartLoading(false);
    }
  };

  const handleGetStarted = async (e) => {
    if (data.category === 'website_updates') {
      // First check if user already has an active update plan
      try {
        const response = await fetch(SummaryApi.validateUpdatePlan.url, {
          method: SummaryApi.validateUpdatePlan.method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            productId: data._id
          })
        });
        
        const result = await response.json();
        if (!result.success) {
          setAlertMessage(result.message);
          setShowAlert(true);
          return;
        }
      } catch (error) {
        console.error('Error:', error);
        setAlertMessage('Something went wrong');
        setShowAlert(true);
        return;
      }
    }
    
    await handleAddToCart(e);
    navigate("/cart");
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setInitialLoading(true);
        
        // Try to get cached data first
        const cachedData = await getCachedProduct(params?.id);
        
        if (cachedData && !isCacheStale(cachedData.lastUpdated)) {
          setData(cachedData);
          setInitialLoading(false);
          setLoading(false);
          
          if (cachedData.additionalFeaturesData) {
            setAdditionalFeaturesData(cachedData.additionalFeaturesData);
            
            const initialQuantities = {};
            const initialSelectedFeatures = [];

            cachedData.additionalFeaturesData.forEach(feature => {
              if (feature.upgradeType === 'component') {
                initialQuantities[feature._id] = feature.baseQuantity || cachedData.totalPages;
                initialSelectedFeatures.push(feature._id);
              }
            });

            setQuantities(initialQuantities);
            setSelectedFeatures(initialSelectedFeatures);
          }
          
          // Still fetch fresh data in background
          fetchFreshData();
        } else {
          await fetchFreshData();
        }
        
        clearOldCache().catch(console.error);
        
      } catch (error) {
        console.error("Error in product details:", error);
        setInitialLoading(false);
        setLoading(false);
      }
    };

    const fetchFreshData = async () => {
      try {
        const response = await fetch(SummaryApi.productDetails.url, {
          method: SummaryApi.productDetails.method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ productId: params?.id })
        });
        
        const dataResponse = await response.json();
        const productData = dataResponse?.data;
        setData(productData);
        
        // Check if the product has additional features and category
        if (productData?.additionalFeatures?.length > 0 && productData.category) {
          // Fetch additional features with category filter
          const featuresPromises = productData.additionalFeatures.map(featureId =>
            fetch(SummaryApi.productDetails.url, {
              method: SummaryApi.productDetails.method,
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ 
                productId: featureId,
                category: productData.category
              })
            }).then(res => res.json())
          );

          const featuresData = await Promise.all(featuresPromises);
          const featuresWithData = featuresData
            .map(fd => fd.data)
            .filter(feature => 
              // Filter features that are compatible with current product category
              feature.compatibleWith && 
              feature.compatibleWith.includes(productData.category)
            );

          // Sort features
          const sortedFeatures = featuresWithData.sort((a, b) => {
            if (a.upgradeType === 'component' && b.upgradeType !== 'component') return -1;
            if (b.upgradeType === 'component' && a.upgradeType !== 'component') return 1;
            return 0;
          });

          setAdditionalFeaturesData(sortedFeatures);

          // Cache the complete data
          await cacheProductDetails(params?.id, {
            ...productData,
            additionalFeaturesData: sortedFeatures
          });

          // Initialize quantities and selected features
          const initialQuantities = {};
          const initialSelectedFeatures = [];

          sortedFeatures.forEach(feature => {
            if (feature.upgradeType === 'component') {
              initialQuantities[feature._id] = feature.baseQuantity || productData.totalPages;
              initialSelectedFeatures.push(feature._id);
            }
          });

          setQuantities(initialQuantities);
          setSelectedFeatures(initialSelectedFeatures);
        }

        setInitialLoading(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fresh data:", error);
        throw error;
      }
    };

    fetchProductDetails();
  }, [params]);

  // Category बेस्ड rendering के लिए helper function
  const shouldShowSection = (category, sectionType) => {
    if (!category) return true;
    
    // Feature upgrades और website updates के लिए कुछ sections को hide करें
    const specialCategories = ['website_updates', 'feature_upgrades'];
    
    if (specialCategories.includes(category) && 
        (sectionType === 'perfectFor' || sectionType === 'packageIncludes')) {
      return false;
    }
    
    return true;
  };

  const shouldShowCustomizePlan = (productData) => {
    // केवल तभी दिखाएं जब additional features हों
    return productData.additionalFeatures && 
           productData.additionalFeatures.length > 0 && 
           additionalFeaturesData.length > 0;
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
        <div className="rounded-lg p-8">
          <TriangleMazeLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {addToCartLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="rounded-lg p-8">
            <TriangleMazeLoader />
          </div>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <section className="relative">
        <div 
          className="h-96 bg-center bg-cover"
          style={{backgroundImage: data.serviceImage && data.serviceImage[0] ? `url(${data.serviceImage[0]})` : 'none'}}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="container mx-auto px-12 absolute inset-0 flex items-center">
          <div className="max-w-xl text-white z-10">
            <h1 className="text-5xl font-bold mb-4 leading-tight">{data.serviceName}</h1>
            <p className="text-lg opacity-90 mb-8 capitalize">
              {data.category?.split('_').join(' ')}
            </p>
            <button 
              onClick={handleGetStarted}
              className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-amber-600 hover:-translate-y-1 hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Who is it for Section */}
            {shouldShowSection(data.category, 'perfectFor') && data.perfectFor?.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Who is it for?</h2>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-4">
                    {data.perfectFor?.map((item, index) => {
                      const Icon = getPerfectForIcon(item);
                      return (
                        <div 
                          key={index} 
                          className="bg-white p-3 rounded-lg flex items-center transition-all duration-300 border border-gray-200 hover:border-blue-600 hover:-translate-y-1 hover:shadow-md"
                        >
                          {Icon && React.createElement(Icon, { 
                            className: "w-5 h-5 text-blue-600 mr-2"
                          })}
                          <span className="font-medium capitalize">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* What's Included Section - Conditionally render */}
            {shouldShowSection(data.category, 'packageIncludes') && data.packageIncludes?.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">What's Included</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.packageIncludes?.map((feature, index) => {
                      const packageOption = packageOptions.find(opt => 
                        opt.value.toLowerCase() === feature.toLowerCase() ||
                        opt.label.toLowerCase() === feature.toLowerCase()
                      );
                      const Icon = getIconForFeature(feature);
                      return (
                        <div key={index} className="flex items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600 flex-shrink-0">
                            {React.createElement(Icon, { 
                              className: "w-6 h-6"
                            })}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold mb-1 text-gray-900 capitalize">{feature}</h3>
                            <p className="text-sm text-gray-500">
                              {packageOption?.description || "Exclusive feature included with your purchase"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

         {/* Description Section - हर formattedDescription को अलग box में दिखाएं */}
         {data.formattedDescriptions?.map((desc, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* कोई heading नहीं */}
                <div className="p-8">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: desc.content }}
                  />
                </div>
              </div>
            ))}
          
          </div>

          {/* Price Calculator Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-8 py-5 rounded-t-lg">
                  <h2 className="text-xl font-semibold">Customize Your Plan</h2>
                </div>
                <div className="p-8">
                  {/* Base Product Display */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{data.serviceName}</h3>
                        <p className="text-xs text-gray-500 capitalize">{data.category?.split('_').join(' ')}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-blue-600">₹{data.sellingPrice?.toLocaleString()}</div>
                  </div>

                  {/* Additional Features Section */}
                  {additionalFeaturesData.map(feature => {
                    const isSelected = selectedFeatures.includes(feature._id);
                    const Icon = feature.upgradeType === "component" ? 
                      () => <span className="text-xl">W</span> :
                      feature.upgradeType === "dynamic_page" || feature.serviceName.toLowerCase().includes("dynamic") ? 
                        () => <span className="text-xl">D</span> :
                      feature.upgradeType === "live_chat" || feature.serviceName.toLowerCase().includes("chat") ? 
                        () => <span className="text-xl">L</span> : 
                      feature.serviceName.toLowerCase().includes("gallery") ?
                        () => <span className="text-xl">D</span> :
                      () => <span className="text-xl">{feature.serviceName.charAt(0).toUpperCase()}</span>;
                    
                    if (feature.upgradeType === 'component') {
                      return (
                        <div key={feature._id} className="py-4 border-b border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600">
                                <span className="text-xl">W</span>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold">{feature.serviceName}</h3>
                                <p className="text-xs text-gray-500">₹{feature.sellingPrice?.toLocaleString()} Per Additional Unit</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="font-semibold text-blue-600 mr-4">₹{feature.sellingPrice?.toLocaleString()}</div>
                              <div className="relative">
                                <input 
                                  type="checkbox" 
                                  id={`feature-${feature._id}`}
                                  className="sr-only"
                                  checked={isSelected}
                                  onChange={() => handleFeatureToggle(feature._id)}
                                />
                                <label 
                                  htmlFor={`feature-${feature._id}`}
                                  className={`h-6 w-6 rounded border flex items-center justify-center cursor-pointer ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}
                                >
                                  {isSelected && <Check className="h-4 w-4" />}
                                </label>
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden mt-2 w-32 ml-14">
                              <button 
                                className="w-8 h-8 bg-gray-50 flex items-center justify-center text-base hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                  if (quantities[feature._id] > data.totalPages) {
                                    setQuantities({
                                      ...quantities,
                                      [feature._id]: quantities[feature._id] - 1
                                    });
                                  }
                                }}
                              >-</button>
                              <input 
                                type="text" 
                                className="w-16 h-8 border-none text-center font-semibold text-sm" 
                                value={quantities[feature._id] || data.totalPages}
                                readOnly 
                              />
                              <button 
                                className="w-8 h-8 bg-gray-50 flex items-center justify-center text-base hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                  setQuantities({
                                    ...quantities,
                                    [feature._id]: (quantities[feature._id] || data.totalPages) + 1
                                  });
                                }}
                              >+</button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={feature._id} className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600">
                            {React.createElement(Icon)}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">{feature.serviceName}</h3>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="font-semibold text-blue-600 mr-4">₹{feature.sellingPrice?.toLocaleString()}</div>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id={`feature-${feature._id}`}
                              className="sr-only"
                              checked={isSelected}
                              onChange={() => handleFeatureToggle(feature._id)}
                            />
                            <label 
                              htmlFor={`feature-${feature._id}`}
                              className={`h-6 w-6 rounded border flex items-center justify-center cursor-pointer ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}
                            >
                              {isSelected && <Check className="h-4 w-4" />}
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Total Price */}
                  <div className="flex justify-between pt-6 mt-5 border-t-2 border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{calculateTotalPrice()?.toLocaleString()}</span>
                  </div>
                  
                  {/* Get Started Button */}
                  <button 
                    onClick={handleGetStarted}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg text-base font-semibold mt-8 transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Recommended Products Section */}
      {data.category && (
        <div className="container mx-auto px-4 lg:px-8 pb-12">
          <VerticalCardProduct 
            category={data.category} 
            heading="Recommended Products"
          />
        </div>
      )}

      {/* Cart Popup */}
      <CartPopup 
        isOpen={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={data}
        className="z-[55]"
      />

      {/* Image Modal */}
      {isImageOpen && data.serviceImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" 
          onClick={() => setIsImageOpen(false)}
        >
          <div className="bg-white rounded-lg max-w-3xl w-full">
            <img 
              src={data.serviceImage[0]} 
              alt={data.serviceName}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal 
        isOpen={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default ProductDetails;