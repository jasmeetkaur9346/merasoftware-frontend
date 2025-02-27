import {Palette, Clock, Wrench, Utensils, Image, MessageSquare, Files, ShoppingBag, Users, MousePointer, Smartphone, Search, Sliders, CreditCard, Calendar, Settings  } from 'lucide-react'

const packageOptions = [
    { value: "premium theme", label: "Premium theme", description: "Exclusive premium theme included with your purchase", icon: Palette },
    { value: "free content updates", label: "Free Content Updates", description: "1-month free content updates and modifications", icon: Clock },
    { value: "free maintenance", label: "Free Maintenance", description: "1-year free maintenance and technical support", icon: Wrench },
    { value: "complete food menu", label: "Complete Food Menu", description: "Comprehensive food menu management system", icon:Utensils  },
    { value: "dynamic gallery", label: "Dynamic Gallery", description: "Showcase your images with beautiful gallery layouts", icon:Image },
    { value: "live chat", label: "Live Chat", description: "Real-time chat support for your customers", icon:MessageSquare },
    { value: "appointment booking", label: "Appointment Booking", description: "Easy scheduling and appointment management", icon:Calendar },
    { value: "admin panel integration", label: "Admin Panel Integration", description: "Powerful admin dashboard to manage your website", icon:Settings },
    { value: "fully customizable", label: "Fully Customizable", description: "Customize every aspect of your website", icon:Sliders },
    { value: "payment gateway", label: "Payment Gateway", description: "Secure payment processing for transactions", icon:CreditCard },
    { value: "unlimited products", label: "Unlimited Products", description: "List unlimited products in your catalog", icon:ShoppingBag },
    { value: "SEO optimized", label: "SEO Optimized", description: "Built-in SEO features for better visibility", icon:Search},
    { value: "user management", label: "User Management", description:"Efficiently manage user accounts and roles", icon:Users },
    { value: "user friendly", label: "User Friendly", description: "Intuitive interface for easy navigation", icon:MousePointer },
    { value: "unlimited pages", label: "Unlimited Pages", description: "Create as many pages as you need for your content", icon:Files },
    { value: "mobile optimized", label: "Mobile Optimized", description: "Fully responsive design for all devices", icon:Smartphone },

  ];

  // Custom Option component for displaying in Select with description
export const CustomPackageOption = ({ data, ...props }) => {
  const Icon = data.icon;
  return (
    <div 
      className={`p-2 ${props.isFocused ? 'bg-slate-100' : ''}`}
      {...props.innerProps}
    >
      <div className="flex items-center gap-2">
        <Icon size={20} />
        <span className="font-medium">{data.label}</span>
      </div>
      {data.description && (
        <div className="text-sm text-gray-600 pl-7 mt-1">
          {data.description}
        </div>
      )}
    </div>
  );
};

// Custom Value component for selected items
export const CustomPackageValue = ({ data, ...props }) => {
  const Icon = data.icon;
  return (
    <div className="flex items-center gap-1 bg-slate-200 rounded px-2 py-1">
      <Icon size={16} />
      <span>{data.label}</span>
      <button
        onClick={props.removeProps.onClick}
        className="ml-1 text-gray-500 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
};

  export default packageOptions;