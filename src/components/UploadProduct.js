import React, { useEffect, useState } from 'react'
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete, MdAdd  } from "react-icons/md";
import SummaryApi from '../common';
import {toast} from 'react-toastify'
import Select from 'react-select'
import packageOptions, { CustomPackageOption, CustomPackageValue } from '../helpers/packageOptions';
import perfectForOptions, { CustomPerfectForOption, CustomPerfectForValue } from '../helpers/perfectForOptions';
import RichTextEditor from '../helpers/richTextEditor';
import PackageSelect from './PackageSelect';
import keyBenefitsOptions, { CustomKeyBenefitOption, CustomKeyBenefitValue } from '../helpers/keyBenefitOptions';

const UploadProduct = ({
    onClose,
    fetchData
}) => {
  const BASE_PAGES = [
    "Home Page",
    "About Us Page",
    "Contact Us Page",
    "Gallery Page"
  ];

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const [categories, setCategories] = useState([]);
  const [compatibleFeatures, setCompatibleFeatures] = useState([]);
    const [data, setData] = useState({
        serviceName : "",
        category : "",
        packageIncludes : [],
        perfectFor : [],
        serviceImage : [],
         price : "",
        sellingPrice : "",
        formattedDescriptions: [{ id: generateId(), content: '' }],  
        // Website service specific fields
        isWebsiteService: false,
        totalPages: 4, 
        checkpoints: [],
        // feature upgrade fields
        isFeatureUpgrade: false,
        compatibleWith: [], 
        keyBenefits: [], 
        additionalFeatures: [],
        validityPeriod: "",
        updateCount: "",
    })


      // Calculate checkpoints whenever totalPages changes
      useEffect(() => {
        if (data.category) {
          const websiteCategories = ['standard_websites', 'dynamic_websites'];
          
          if (websiteCategories.includes(data.category) && data.totalPages >= 4) {
            // Existing website checkpoint calculation
            const structureCheckpoints = [
              { name: "Website Structure ready", percentage: 2 },
              { name: "Header created", percentage: 5 },
              { name: "Footer created", percentage: 5 },
            ];
      
            const remainingPercentage = 78;
            const percentagePerPage = Number((remainingPercentage / data.totalPages).toFixed(2));
      
            const pageCheckpoints = Array.from({ length: data.totalPages }, (_, index) => ({
              name: index < 4 ? BASE_PAGES[index] : `Additional Page ${index - 3}`,
              percentage: percentagePerPage
            }));
      
            const finalCheckpoint = [{ name: "Final Testing", percentage: 10 }];
      
            setData(prev => ({
              ...prev,
              checkpoints: [
                ...structureCheckpoints,
                ...pageCheckpoints,
                ...finalCheckpoint
              ]
            }));
          } else if (data.category === 'cloud_software_development') {
            // Cloud software checkpoints
            setData(prev => ({
              ...prev,
              checkpoints: [
                { name: "Project Initiation", percentage: 4 },
                { name: "Core Backend & Database Setup", percentage: 2 },
                { name: "Server & database architecture setup", percentage: 2 },
                { name: "User roles & authentication system", percentage: 8 },
                { name: "Dashboard structure & data flow design", percentage: 4 },
                { name: "Basic backend functionality setup", percentage: 5 },
                { name: "Core Modules Development", percentage: 5 },
                { name: "Frontend Development & UI Implementation", percentage: 20 },
                { name: "Dashboard & reports visualization", percentage: 5 },
                { name: "Integration of UI with backend functions", percentage: 20 },
                { name: "Responsive design for mobile & desktop", percentage: 5 },
                { name: "User-friendly navigation & search features", percentage: 2 },
                { name: "Email & SMS Notifications", percentage: 3 },
                { name: "Role-Based Access Control", percentage: 3 },
                { name: "Basic Third-Party Integrations", percentage: 4 },
                { name: "Performance testing across devices", percentage: 2 },
                { name: "Fixing bugs & security updates", percentage: 2 },
                { name: "User Acceptance Testing (UAT)", percentage: 2 },
                { name: "Final review & approval by client", percentage: 2 },
                { name: "Deployment & Launch", percentage: 0 }
              ]
            }));
          }
        }
      }, [data.category, data.totalPages]);


     // Fetch categories when component mounts
     useEffect(() => {
      const fetchCategories = async () => {
          try {
              const response = await fetch(SummaryApi.allCategory.url);
              const result = await response.json();
              if (result.success) {
                  setCategories(result.data);
              }
          } catch (error) {
              console.error("Error fetching categories:", error);
          }
      };
      fetchCategories();
  }, []);

  // Add this function after your other useEffect hooks
const fetchCompatibleFeatures = async (category) => {
  try {
    const response = await fetch(`${SummaryApi.getCompatibleFeatures.url}?category=${category}`);
    const result = await response.json();
    if (result.success) {
      // Transform the data for Select component
      const formattedFeatures = result.data.map(feature => ({
        value: feature._id,
        label: feature.serviceName,
        price: feature.price,
        description: feature.description,
      }));
      setCompatibleFeatures(formattedFeatures);
    }
  } catch (error) {
    console.error("Error fetching compatible features:", error);
    toast.error("Error loading compatible features");
  }
};

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
    const [fullScreenImage, setFullScreenImage] = useState("")

    const handleOnChange = (e)=> {
      const { name, value } = e.target

      setData((preve)=>{
      // If category changes
      if (name === "category") {
        // Define which categories should have additional features
        const webCategories = ['standard_websites', 'dynamic_websites', 'cloud_software_development', 'app_development'];
        
        if (webCategories.includes(value)) {
          fetchCompatibleFeatures(value);
        } else {
          setCompatibleFeatures([]); // Clear features if not applicable
        }
        
        // Handle website specific fields visibility
        setData(prev => ({
          ...prev,
          [name]: value,
          isWebsiteService: webCategories.includes(value),
          isFeatureUpgrade: value === 'feature_upgrades'
        }));
      }
     // Otherwise, just update the field
        return {
          ...preve,
          [name]: value,
        } 
      })
    }

    const categoryOptions = categories.map(cat => ({
      value: cat.categoryValue,
      label: cat.categoryName
    }));

     // Add new description field
     const handleAddDescription = () => {
      setData(prev => ({
          ...prev,
          formattedDescriptions: [...prev.formattedDescriptions, { id: generateId(), content: '' }]
      }));
  };

  // Remove description field
  const handleRemoveDescription = (idToRemove) => {
    setData(prev => ({
        ...prev,
        formattedDescriptions: prev.formattedDescriptions.filter(item => item.id !== idToRemove)
    }));
};

  // Handle description changes
  const handleDescriptionChange = (content, id) => {
    setData(prev => ({
        ...prev,
        formattedDescriptions: prev.formattedDescriptions.map(item => 
            item.id === id ? { ...item, content } : item
        )
    }));
};
    const handleCompatibleCategoriesChange  = (selectedOptions) => {
      setData((prev) => ({
        ...prev,
        compatibleWith: selectedOptions.map((option) => option.value),
      }));
    };

    // Add these handler functions
    const handleKeyBenefitsChange = (selectedOptions) => {
      setData((prev) => ({
        ...prev,
        keyBenefits: selectedOptions.map((option) => option.value),
      }));
    };
    

    const handlePackageIncludesChange = (selectedOptions) => {
      setData((preve) => ({
        ...preve,
        packageIncludes: selectedOptions.map((option) => option.value),
      }));
    };
    
    // Add a new handler function for perfectFor
    const handlePerfectForChange = (selectedOptions) => {
      setData((preve) => ({
        ...preve,
        perfectFor: selectedOptions.map((option) => option.value),
      }));
    };

    const handleAdditionalFeaturesChange = (selectedOptions) => {
      setData(prev => ({
        ...prev,
        additionalFeatures: selectedOptions.map(option => option.value)
      }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0]
        const uploadImageCloudinary = await uploadImage(file)

        setData((preve)=>{
          return{
            ...preve,
            serviceImage : [ ...preve.serviceImage, uploadImageCloudinary.url]
          }
        })
    }

    const handleDeleteProductImage = async(index)=>{
      console.log("image index",index);

      const newProductImage = [...data.serviceImage]
      newProductImage.splice(index,1)

      setData((preve)=>{
        return{
          ...preve,
          serviceImage : [...newProductImage]
        }
      })
    }

    // upload product
    const handleSubmit = async (e) => {
      e.preventDefault()

      // Filter out empty descriptions
      const validDescriptions = data.formattedDescriptions.filter(
        item => item.content && item.content.trim() !== ''
      );

      // Create submission data with additional features if applicable
  const submissionData = {
    ...data,
    formattedDescriptions: validDescriptions.map(item => ({ content: item.content }))
  };
      
      const response = await fetch(SummaryApi.uploadProduct.url,{
        method : SummaryApi.uploadProduct.method,
        credentials : 'include',
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify(submissionData)
      })
      
      const responseData = await response.json()

      if(responseData.success){
        toast.success(responseData?.message)
        onClose()
        fetchData()
      }

      if(responseData.error){
        toast.error(responseData?.message)
      }
    }

    // Add this helper function
const shouldShowWebsiteFields = (category) => {
  const websiteCategories = ['standard_websites', 'dynamic_websites', 'cloud_software_development', 'app_development'];
  return category && websiteCategories.includes(category);
};
// Add this helper function alongside shouldShowWebsiteFields
const shouldShowFeatureFields = (category) => {
  return category === 'feature_upgrades';
};

const shouldShowWebsiteUpdateFields = (category) => {
  return category === 'website_updates';
};
// Custom Option Component for feature display
const CustomFeatureOption = ({ data, ...props }) => {
  return (
    <div 
      className={`p-2 ${props.isFocused ? 'bg-slate-100' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="font-medium">{data.label}</div>
      <div className="text-sm text-gray-600 flex justify-between">
        <span>Additional Feature</span> {/* Replace type distinction with generic label */}
        <span>₹{data.price}</span>
      </div>
      {data.description && (
        <div className="text-xs text-gray-500 mt-1">
          {data.description.length > 100 
            ? `${data.description.substring(0, 100)}...` 
            : data.description}
        </div>
      )}
    </div>
  );
};

 // Close popup on Esc key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Close popup on background click
    const handleBackgroundClick = (e) => {
        if (e.target.id === 'popup-background') {
            onClose();
        }
    };

  return (
    <div 
    id="popup-background"
    className='fixed w-full h-full bg-slate-200 bg-opacity-40 top-10 left-0 right-0 bottom-0 flex justify-center items-center'
    onClick={handleBackgroundClick}>
      <div className='bg-white p-4 rounder w-full max-w-2xl h-full max-h-[75%] overflow-hidden'>

      <div className='flex justify-between items-center pb-3'>
        <h2 className='font-bold text-lg'>Upload Service</h2>
        <div className='text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose/>
        </div>
      </div>

      <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
        <label htmlFor='serviceName'>Service Name :</label>
        <input 
        type='text' 
        id='serviceName'
        placeholder='enter service name'
        name='serviceName'
        value={data.serviceName}
        onChange={handleOnChange}
        className='p-2 bg-slate-100 border rounded'
        required
        />


        <label htmlFor='category' className='mt-3'>Service Category :</label>   
        <select required value={data.category} id='category' name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
        <option value="">Select Category</option>
            {categories.map((cat) => (
                <option 
                    value={cat.categoryValue} 
                    key={cat.categoryId}
                >
                    {cat.categoryName}
                </option>
            ))}
        </select> 

        {shouldShowWebsiteFields(data.category) && (
  <>
    {/* Only show pages selector for website categories, not cloud software */}
    {['standard_websites', 'dynamic_websites'].includes(data.category) && (
      <div className='mt-3'>
        <label htmlFor='totalPages' className='block mb-2'>
          Number of Pages: <span className='text-sm text-gray-500'>(Includes {BASE_PAGES.join(", ")})</span>
        </label>
        <select
          id='totalPages'
          name='totalPages'
          value={data.totalPages}
          onChange={(e) => setData(prev => ({
            ...prev,
            totalPages: parseInt(e.target.value)
          }))}
          className='w-full p-2 bg-slate-100 border rounded'
        >
          {Array.from({ length: 47 }, (_, i) => i + 4).map((num) => (
            <option key={num} value={num}>
              {num} Pages {num === 4 ? '(Minimum)' : ''}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Display checkpoints */}
    {data.checkpoints.length > 0 && (
      <div className='mt-3'>
        <label className='block mb-2'>Progress Checkpoints:</label>
        <div className='bg-slate-50 p-3 rounded mt-1 max-h-60 overflow-y-auto'>
          {data.checkpoints.map((checkpoint, index) => (
            <div 
              key={index} 
              className={`flex justify-between items-center py-1 border-b last:border-0`}
            >
              <span className='text-sm'>{checkpoint.name}</span>
              <span className='text-sm text-gray-600'>{checkpoint.percentage}%</span>
            </div>
          ))}
          <div className='mt-2 pt-2 border-t'>
            <div className='flex justify-between font-medium'>
              <span>Total Percentage:</span>
              <span>
                {data.checkpoints.reduce((sum, cp) => sum + cp.percentage, 0).toFixed(2)}%
              </span>
            </div>
            {['standard_websites', 'dynamic_websites'].includes(data.category) && (
              <div className='flex justify-between font-medium'>
                <span>Total Pages:</span>
                <span>{data.totalPages}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

              <label htmlFor='packageIncludes' className='mt-3'>Package Includes:</label>
          <PackageSelect
            options={packageOptions}
            value={data.packageIncludes.map(value => {
              const option = packageOptions.find(opt => opt.value === value);
              return option;
            })}
            name='packageIncludes'
            id='packageIncludes'
            onChange={handlePackageIncludesChange}
            components={{
              Option: CustomPackageOption,
              MultiValue: CustomPackageValue
            }}
            placeholder="Select package options"
          />

        <label htmlFor='perfectFor' className='mt-3'>Perfect For:</label>
        <PackageSelect
  options={perfectForOptions}
  value={data.perfectFor.map(value => {
    const option = perfectForOptions.find(opt => opt.value === value);
    return option;
  })}
   name='perfectFor'
  id='perfectFor'
  onChange={handlePerfectForChange}
  components={{
    Option: CustomPerfectForOption,
    MultiValue: CustomPerfectForValue
  }}
  placeholder="Select target audience"
/>

{compatibleFeatures.length > 0 && (
  <div className="mt-3">
    <label htmlFor="additionalFeatures" className="block mb-2">
      Additional Features Available:
    </label>
    <PackageSelect
      options={compatibleFeatures}
      value={compatibleFeatures.filter(feature => 
        data.additionalFeatures.includes(feature.value)
      )}
      onChange={handleAdditionalFeaturesChange}
      components={{
        Option: CustomFeatureOption
      }}
      placeholder="Select additional features"
    />
    <p className="text-xs text-gray-500 mt-1">
      These features will be available as upgrades for this product
    </p>
  </div>
)}
              </>
            )}

        {
          shouldShowFeatureFields(data.category) && (
            <>
            <label htmlFor='packageIncludes' className='mt-3'>Package Includes:</label>
          <PackageSelect
            options={packageOptions}
            value={data.packageIncludes.map(value => {
              const option = packageOptions.find(opt => opt.value === value);
              return option;
            })}
            name='packageIncludes'
            id='packageIncludes'
            onChange={handlePackageIncludesChange}
            components={{
              Option: CustomPackageOption,
              MultiValue: CustomPackageValue
            }}
            placeholder="Select package options"
          /> 

              {/* Compatible With Field */}
              <label htmlFor='compatibleCategories' className='mt-3'>Compatible With:</label>
              <Select
              isMulti
              options={categoryOptions}
              value={categoryOptions.filter(option => 
                data.compatibleWith.includes(option.value) // Change field name here
              )}
              name='compatibleWith' // Change field name here
              id='compatibleWith' // Change field name here
              onChange={handleCompatibleCategoriesChange}
              className='basic-multi-select bg-slate-100 border rounded'
              classNamePrefix='select'
              placeholder="Select compatible platforms"
            />

              {/* Key Benefits Field */}
            <label htmlFor='keyBenefits' className='mt-3'>Key Benefits:</label>
            <Select
              isMulti
              options={keyBenefitsOptions}
              value={data.keyBenefits.map(value => {
                const option = keyBenefitsOptions.find(opt => opt.value === value);
                return option;
              })}
              name='keyBenefits'
              id='keyBenefits'
              onChange={handleKeyBenefitsChange}
              components={{
                Option: CustomKeyBenefitOption,
                MultiValue: CustomKeyBenefitValue
              }}
              className='basic-multi-select bg-slate-100 border rounded'
              classNamePrefix='select'
              placeholder="Select key benefits"
            />
            </>
          )
        }

{shouldShowWebsiteUpdateFields(data.category) && (
    <>
     <label htmlFor='packageIncludes' className='mt-3'>Package Includes:</label>
          <PackageSelect
            options={packageOptions}
            value={data.packageIncludes.map(value => {
              const option = packageOptions.find(opt => opt.value === value);
              return option;
            })}
            name='packageIncludes'
            id='packageIncludes'
            onChange={handlePackageIncludesChange}
            components={{
              Option: CustomPackageOption,
              MultiValue: CustomPackageValue
            }}
            placeholder="Select package options"
          />

        {/* Validity Period Field */}
        <label htmlFor='validityPeriod' className='mt-3'>Validity Period (Days):</label>
        <input 
            type='number' 
            id='validityPeriod'
            name='validityPeriod'
            placeholder='Enter validity period in days'
            value={data.validityPeriod}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
        />

        <label htmlFor='updateCount' className='mt-3'>Updates Count:</label>
        <input 
            type='number' 
            id='updateCount'
            name='updateCount'
            placeholder='Enter How many updates in this plan'
            value={data.updateCount}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
        />

        {/* Compatible Categories Field */}
        <label htmlFor='compatibleCategories' className='mt-3'>Compatible With:</label>
        <Select
              isMulti
              options={categoryOptions}
              value={categoryOptions.filter(option => 
                data.compatibleWith.includes(option.value) // Change field name here
              )}
              name='compatibleWith' // Change field name here
              id='compatibleWith' // Change field name here
              onChange={handleCompatibleCategoriesChange}
              className='basic-multi-select bg-slate-100 border rounded'
              classNamePrefix='select'
              placeholder="Select compatible platforms"
            />
    </>
)}

        <label htmlFor='serviceImage' className='mt-3'>Service Image :</label> 
        <label htmlFor='uploadImageInput'>

        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
            <span className='text-4xl'><FaCloudUploadAlt/></span>
            <p className='text-sm'>Upload Product Image</p>
            <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
            </div>   
        </div>

        </label>
        <div>
        {
          data?.serviceImage[0] ? (
           <div className='flex items-center gap-2'>
            {
              data.serviceImage.map((el,index)=>{
              return(
               <div key={index} className='relative group'>
               <img 
                  src={el} 
                  alt={el} 
                  width={80} 
                  height={80} 
                  className='bg-slate-100 border cursor-pointer'
                  onClick={()=>{
                    setOpenFullScreenImage(true)
                    setFullScreenImage(el)
                  }} />

                  <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={()=>handleDeleteProductImage(index)}>
                    <MdDelete/>
                  </div>
               </div>
              )
            })
            }
           </div>
          ) : (
            <p className='text-red-600 text-xs'>* Please Upload Product Image</p>
          )
        }
            
        </div>

        <label htmlFor='price' className='mt-3'>Price :</label>
        <input 
        type='number' 
        id='price'
        placeholder='enter price'
        name='price'
        value={data.price}
        onChange={handleOnChange}
        className='p-2 bg-slate-100 border rounded'
        required
        />

        <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
        <input 
        type='number' 
        id='sellingPrice'
        placeholder='enter selling price'
        name='sellingPrice'
        value={data.sellingPrice}
        onChange={handleOnChange}
        className='p-2 bg-slate-100 border rounded'
        required
        />


        {/* Add Description Button */}
        <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleAddDescription}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                             Add <MdAdd />
                        </button>
                    </div>

                    {/* Dynamic Rich Text Editors */}
                    {data.formattedDescriptions.map((item) => (
    <div key={item.id} className="mt-3 relative">
        <RichTextEditor
            value={item.content}
            onChange={(newContent) => handleDescriptionChange(newContent, item.id)}
            placeholder="Enter description..."
        />
        <button
            type="button"
            onClick={() => handleRemoveDescription(item.id)}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
            <MdDelete size={16} />
        </button>
    </div>
))}
       
       {/* Submit Button */}
        <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload Service</button>

      </form>
      
      </div>

      {/* display image full screen */}

        {
          openFullScreenImage && (
            <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
          )
        }
      
    </div>
  )
}

export default UploadProduct;
