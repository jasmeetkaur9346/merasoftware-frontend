import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdDelete, MdEdit, MdAdd } from 'react-icons/md';
import SummaryApi from '../common';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const AdminCouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  // State for the calculated discount
  const [calculatedDiscount, setCalculatedDiscount] = useState(null);
  const [selectedProductPrice, setSelectedProductPrice] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    minAmount: '',
    maxDiscount: '',
    targetPrice: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    usageLimit: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getAllCoupons.url, {
        method: SummaryApi.getAllCoupons.method,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setCoupons(data.data);
      } else {
        toast.error('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(SummaryApi.getProductsForCoupon.url, {
        method: SummaryApi.getProductsForCoupon.method,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setAvailableProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Calculate discount from target price
  const calculateDiscountFromTarget = async () => {
    if (selectedProducts.length !== 1) {
      toast.error('Please select exactly one product for target price calculation');
      return;
    }

    try {
      // Fetch the product details to get the price
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: selectedProducts[0] })
      });
      
      const dataResponse = await response.json();
      const productData = dataResponse?.data;
      
      if (!productData || !productData.sellingPrice) {
        toast.error('Could not fetch product price. Please try again.');
        return;
      }
      
      const originalPrice = productData.sellingPrice;
      const targetPrice = parseFloat(formData.targetPrice);
      setSelectedProductPrice(originalPrice);
      
      if (targetPrice >= originalPrice) {
        toast.error('Target price must be less than the original price');
        return;
      }
      
      // Calculate the discount percentage
      const discountAmount = originalPrice - targetPrice;
      const discountPercentage = (discountAmount / originalPrice) * 100;
      
      // Update form data and calculated discount
      setCalculatedDiscount(discountPercentage);
      setFormData({
        ...formData,
        discount: discountPercentage.toFixed(2)
      });
      
      toast.success(`Discount calculated: ${discountPercentage.toFixed(2)}%`);
      
    } catch (error) {
      console.error('Error calculating discount:', error);
      toast.error('Something went wrong while calculating discount');
    }
  };

  const handleProductSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedProducts(selectedOptions);

    // Reset calculated discount when product selection changes
    if (formData.targetPrice) {
      setCalculatedDiscount(null);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount: '',
      type: 'percentage',
      minAmount: '',
      maxDiscount: '',
      targetPrice: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      usageLimit: '',
      isActive: true
    });
    setSelectedProducts([]);
    setCalculatedDiscount(null);
    setSelectedProductPrice(null);
    setEditMode(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (formData.targetPrice && calculatedDiscount === null) {
      toast.error('Please calculate the discount first');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare coupon data - include targetPrice if using that method
      const couponData = {
        ...formData,
        applicableProducts: selectedProducts
      };
      
      // If using target price, ensure we're submitting the calculated discount
      if (formData.targetPrice && calculatedDiscount !== null) {
        couponData.discount = calculatedDiscount;
        // optionally preserve the target price if you want to show it later
      }
      
      let response;
      if (editMode) {
        response = await fetch(`${SummaryApi.updateCoupon.url}/${formData._id}`, {
          method: SummaryApi.updateCoupon.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(couponData)
        });
      } else {
        response = await fetch(SummaryApi.createCoupon.url, {
          method: SummaryApi.createCoupon.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(couponData)
        });
      }
  
      const data = await response.json();
      if (data.success) {
        toast.success(editMode ? 'Coupon updated successfully' : 'Coupon created successfully');
        fetchCoupons();
        setFormOpen(false);
        resetForm();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error submitting coupon:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      _id: coupon._id,
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      minAmount: coupon.minAmount || '',
      maxDiscount: coupon.maxDiscount || '',
      targetPrice: coupon.targetPrice || '',
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      endDate: new Date(coupon.endDate).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit || '',
      isActive: coupon.isActive
    });
    
    setSelectedProducts(coupon.applicableProducts.map(p => p._id || p));
    setCalculatedDiscount(coupon.targetPrice ? coupon.discount : null);
    setEditMode(true);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.deleteCoupon.url}/${id}`, {
        method: SummaryApi.deleteCoupon.method,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } else {
        toast.error(data.message || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.admin.coupons.update.url}/${id}`, {
        method: SummaryApi.admin.coupons.update.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchCoupons();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
          <button
            onClick={() => {
              resetForm();
              setFormOpen(!formOpen);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {formOpen ? 'Cancel' : (
              <>
                <MdAdd className="mr-1" />
                Create Coupon
              </>
            )}
          </button>
        </div>

        {/* Coupon Form */}
        {formOpen && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Coupon' : 'Create New Coupon'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code*
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. SAVE20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                {formData.type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Pricing Method
                    </label>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="manualDiscount"
                          name="pricingMethod"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={!formData.targetPrice}
                          onChange={() => {
                            // Clear target price but keep discount if exists
                            setFormData({
                              ...formData,
                              targetPrice: ''
                            });
                            setCalculatedDiscount(null);
                          }}
                        />
                        <label htmlFor="manualDiscount" className="ml-2 block text-sm text-gray-700">
                          Manual Discount (%)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="targetPrice"
                          name="pricingMethod"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={!!formData.targetPrice}
                          onChange={() => {
                            // Set an empty string to enable target price mode
                            setFormData({
                              ...formData,
                              targetPrice: ' ', // Use a space to make it truthy but still visually empty
                              discount: '' // Clear discount when switching to target price
                            });
                          }}
                        />
                        <label htmlFor="targetPrice" className="ml-2 block text-sm text-gray-700">
                          Target Price (Auto-calculate discount)
                        </label>
                      </div>
                    </div>
                      
                    {!formData.targetPrice ? (
                      // Manual discount input
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Value (%)*
                        </label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g. 10 (%)"
                          required={!formData.targetPrice}
                        />
                      </div>
                    ) : (
                      // Target price input
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Price (₹)*
                        </label>
                        <div className="flex flex-col gap-2">
                          <input
                            type="number"
                            name="targetPrice"
                            value={typeof formData.targetPrice === 'string' ? formData.targetPrice.trim() : formData.targetPrice} // Trim any space we might have added
                            onChange={(e) => {
                              const targetValue = e.target.value;
                              setFormData({
                                ...formData,
                                targetPrice: targetValue
                              });
                              
                              // Reset calculated discount when target price changes
                              setCalculatedDiscount(null);
                              
                              // Show product selector if entering target price
                              if (targetValue && selectedProducts.length === 0) {
                                toast.info("Please select a product to calculate discount");
                              }
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Amount you want to receive"
                            required={!!formData.targetPrice}
                          />
                          
                          {/* Calculate button */}
                          {formData.targetPrice && selectedProducts.length > 0 && (
                            <button
                              type="button"
                              onClick={calculateDiscountFromTarget}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                              Calculate Discount
                            </button>
                          )}
                          
                          {/* Show result of calculation */}
                          {calculatedDiscount !== null && (
                            <div className="mt-2 p-2 bg-blue-100 rounded-md">
                              <p className="text-sm text-blue-800">
                                Calculated discount: <span className="font-semibold">{calculatedDiscount.toFixed(2)}%</span>
                              </p>
                              <p className="text-xs text-blue-600">
                                This will set discount from ₹{selectedProductPrice?.toLocaleString()} to ₹{parseInt(formData.targetPrice).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.type === 'fixed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value*
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. 500 (₹)"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Purchase Amount
                  </label>
                  <input
                    type="number"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty for no minimum"
                  />
                </div>

                {formData.type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount Amount
                    </label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave empty for no limit"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date*
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty for no limit"
                  />
                </div>

                <div className="flex items-center h-full pt-6">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applicable Products (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Leave empty to apply to all products
                </p>
                <select
                  multiple
                  size="5"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedProducts}
                  onChange={handleProductSelect}
                >
                  {availableProducts.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.serviceName} ({product.category.replace(/_/g, ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editMode ? 'Update Coupon' : 'Create Coupon')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons List */}
        {loading && !formOpen ? (
          <div className="flex justify-center py-12">
            <TriangleMazeLoader />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Coupon Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Discount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Validity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Usage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No coupons found
                      </td>
                    </tr>
                  ) : (
                    coupons.map((coupon) => (
                      <tr key={coupon._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-900">{coupon.code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {coupon.type === 'percentage' 
                            ? `${coupon.discount}%` 
                            : `₹${coupon.discount}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {coupon.minAmount > 0 && `Min: ₹${coupon.minAmount}`}
                          {coupon.minAmount > 0 && coupon.maxDiscount && ' | '}
                          {coupon.type === 'percentage' && coupon.maxDiscount && 
                            `Max: ₹${coupon.maxDiscount}`}
                          {coupon.targetPrice && 
                            `${coupon.minAmount > 0 || coupon.maxDiscount ? ' | ' : ''}Target: ₹${coupon.targetPrice}`}
                        </div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(coupon.startDate)} to {formatDate(coupon.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(coupon._id, coupon.isActive)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              coupon.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            Used: {coupon.usedCount || 0} times
                          </div>
                          {coupon.usageLimit && (
                            <div className="text-xs">
                              Limit: {coupon.usageLimit}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <MdEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <MdDelete className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCouponPage;