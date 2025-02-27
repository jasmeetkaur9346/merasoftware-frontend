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

const ProductDetails = () => {
  const [data, setData] = useState({
    serviceName: "",
    category: "",
    packageIncludes: [],
    perfectFor: [],
    serviceImage: [],
    description: "",
    websiteTypeDescription: "",
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

// Modify the calculation of total price to include quantities
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
          return addToCart(e, featureId, quantity);  // Make sure your addToCart function accepts quantity
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
                category: productData.category  // Add category to the request
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

  // const validateWebsiteUpdate  = async () => {
  //   try {
  //     const response = await fetch(SummaryApi.validateUpdatePlan.url, {
  //       method: SummaryApi.validateUpdatePlan.method,
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({
  //         productId: params.id
  //       })
  //     });
  
  //     const data = await response.json();
  //     if (!data.success) {
  //       setAlertMessage(data.message);
  //       setShowAlert(true);
  //       return false;
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setAlertMessage('Something went wrong');
  //     setShowAlert(true);
  //     return false;
  //   }
  // };

  // if (initialLoading) {
  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
  //       <div className="rounded-lg p-8">
  //         <TriangleMazeLoader />
  //       </div>
  //     </div>
  //   );
  // }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {addToCartLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="rounded-lg p-8">
            <TriangleMazeLoader />
          </div>
        </div>
      )}

      {/* Image Preview Section */}
      <div className="relative">
        <div className="w-full h-80 bg-gray-200">
          {data.serviceImage && data.serviceImage[0] ? (
            <img 
              src={data.serviceImage[0]} 
              alt={data.serviceName}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsImageOpen(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        {/* Semi-transparent header overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <h1 className="text-xl font-bold mb-1">{data.serviceName}</h1>
          <p className="text-sm text-gray-200 capitalize">
            {data.category?.split('_').join(' ')}
          </p>
        </div>
      </div>

      {/* Who is it for Section - Moved up right after image */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-3">Who is it for?</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {data.perfectFor?.map((item, index) => {
              const Icon = getPerfectForIcon(item) || perfectForOptions[0].icon;
              return (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                  {React.createElement(Icon, { 
                    className: "w-4 h-4 text-blue-600"
                  })}
                  <span className="text-gray-600 capitalize">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Sections */}
      <div className="px-4 space-y-6">
        {/* What's Included Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">What's Included</h2>
          <div className="space-y-3">
            {data.packageIncludes?.map((feature, index) => {
              const packageOption = packageOptions.find(opt => 
                opt.value.toLowerCase() === feature.toLowerCase() ||
                opt.label.toLowerCase() === feature.toLowerCase()
              );
              const Icon = getIconForFeature(feature);
              return (
                <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                    {React.createElement(Icon, { 
                      className: "w-5 h-5 text-blue-600"
                    })}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 block capitalize">{feature}</span>
                    {packageOption && (
                      <p className="text-sm text-gray-500 mt-1">{packageOption.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Additional Features Section */}
        {additionalFeaturesData.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Customize Your Plan</h2>
              <button 
                onClick={handleSelectAll}
                className="text-blue-600 text-sm font-medium px-3 py-1 bg-blue-50 rounded-full"
              >
                {selectedFeatures.length === additionalFeaturesData.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-3">
            {additionalFeaturesData.map(feature => {
                const isSelected = selectedFeatures.includes(feature._id);
                
                if (feature.upgradeType === 'component') {
                  return (
                    <QuantitySelector
                      key={feature._id}
                      feature={feature}
                      baseProduct={data}
                      quantity={quantities[feature._id] || data.totalPages}
                      onQuantityChange={(newQuantity) => {
                        setQuantities(prev => ({
                          ...prev,
                          [feature._id]: newQuantity
                        }));
                      }}
                      isSelected={isSelected}
                      onSelect={() => handleFeatureToggle(feature._id)}
                    />
                  );
                }

                const Icon = getIconForFeature(feature.serviceName);
                return (
                  <div
                    key={feature._id}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg border shadow-sm"
                    onClick={() => handleFeatureToggle(feature._id)}
                  >
                    <div className="shrink-0">
                      {React.createElement(Icon, { 
                        className: "w-5 h-5 text-gray-400"
                      })}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-700">{feature.serviceName}</p>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        ₹{feature.sellingPrice?.toLocaleString()}
                      </p>
                    </div>
                    <div className="shrink-0 w-5 h-5 mt-1 rounded border border-gray-300 flex items-center justify-center">
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            {data.formattedDescriptions?.map((desc, index) => (
              <div 
                key={index} 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: desc.content }}
              />
            ))}
            {data.description && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            )}
            {data.websiteTypeDescription && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.websiteTypeDescription }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      {/* Get Started Section */}
      <div className="fixed bottom-[56px] left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="text-lg font-bold text-gray-900">₹{calculateTotalPrice()?.toLocaleString()}</p>
          </div>
          <button 
            onClick={handleGetStarted}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

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

      {/* Recommended Products */}
      {data.category && (
        <VerticalCardProduct 
          category={data.category} 
          heading="Recommended Products"
        />
      )}

      <AlertModal 
        isOpen={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default ProductDetails;