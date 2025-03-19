import {Palette, Clock, Wrench, Utensils, Image, MessageSquare, Files, ShoppingBag, Users, MousePointer, Smartphone, Search, Sliders, CreditCard, Calendar, Settings,Lock, Shield, UserCog, Activity, FileText, Wallet, BarChart2, Zap, Headphones, PieChart, BarChart, Globe, Package, RefreshCw, Bell, Layers, Edit, FileCode, Layout, MessageCircle, Share2, Cloud, Maximize, Folder, TrendingUp, CheckCircle, DollarSign} from 'lucide-react'

const packageOptions = [
    { value: "premium theme", label: "Premium theme", description: "Exclusive premium theme included with your purchase", icon: Palette },
    { value: "free content updates", label: "Free Content Updates", description: "1-month free content updates and modifications", icon: Clock },
    { value: "free maintenance", label: "Free Maintenance", description: "1-year free maintenance and technical support", icon: Wrench },
    { value: "complete food menu", label: "Complete Food Menu", description: "Comprehensive food menu management system", icon:Utensils  },
    { value: "dynamic gallery", label: "Dynamic Gallery", description: "Showcase your images with beautiful gallery layouts", icon:Image },
    { value: "live chat", label: "Live Chat", description: "Real-time chat support for your customers", icon:MessageSquare },
    { value: "4 pages", label: "4 Pages", description: "Essential pages for this website", icon: FileText},
    { value: "appointment booking", label: "Appointment Booking", description: "Easy scheduling and appointment management", icon:Calendar },
    { value: "admin panel integration", label: "Admin Panel Integration", description: "Powerful admin dashboard to manage your website", icon:Settings },
    { value: "5 pages", label: "5 Pages", description: "Essential pages for this website", icon: FileText},
    { value: "fully customizable", label: "Fully Customizable", description: "Customize every aspect of your website", icon:Sliders },
    { value: "7 pages", label: "7 Pages", description: "Essential pages for this website", icon: FileText},
    { value: "payment gateway", label: "Payment Gateway", description: "Secure payment processing for transactions", icon:CreditCard },
    { value: "unlimited products", label: "Unlimited Products", description: "List unlimited products in your catalog", icon:ShoppingBag },
    { value: "SEO optimized", label: "SEO Optimized", description: "Built-in SEO features for better visibility", icon:Search},
    { value: "10 pages", label: "10 Pages", description: "Essential pages for this website", icon: FileText},
    { value: "12 pages", label: "12 Pages", description: "Essential pages for this website", icon: FileText},
    { value: "user management", label: "User Management", description:"Efficiently manage user accounts and roles", icon:Users },
    { value: "user friendly", label: "User Friendly", description: "Intuitive interface for easy navigation", icon:MousePointer },
    { value: "unlimited pages", label: "Unlimited Pages", description: "Create as many pages as you need for your content", icon:Files },
    { value: "mobile optimized", label: "Mobile Optimized", description: "Fully responsive design for all devices", icon:Smartphone },
    { value: "seamless multi user access", label: "Seamless Multi-User Access", icon: Users },
    { value: "controlled role based permissions", label: "Controlled Role-Based Permissions", icon: Lock },
    { value: "enhanced security authentication", label: "Enhanced Security & Authentication", icon: Shield },
    { value: "easy profile account management", label: "Easy Profile & Account Management", icon: UserCog },
    { value: "real time work activity tracking", label: "Real-Time Work & Activity Tracking", icon: Activity },
    { value: "detailed audit logs accountability", label: "Detailed Audit Logs & Accountability", icon: FileText },
    { value: "seamless online payment", label: "Seamless Online Payment Processing", icon: CreditCard },
    { value: "multiple payment methods", label: "Multiple Payment Methods Support (UPI, Cards, Net Banking, Wallets)", icon: Wallet },
    { value: "secure encrypted transactions", label: "Secure & Encrypted Transactions", icon: Lock },
    { value: "real time payment tracking", label: "Real-Time Payment Tracking & Reports", icon: BarChart2 },
    { value: "enhanced user experience", label: "Enhanced User Experience with Quick Checkout", icon: Zap },
    { value: "instant customer support", label: "Instant Real-Time Customer Support", icon: Headphones },
    { value: "multi agent collaboration", label: "Multi-Agent & Team Collaboration", icon: Users },
    { value: "visitor tracking insights", label: "Visitor Tracking & Engagement Insights", icon: PieChart },
    { value: "mobile app support", label: "Mobile App for On-the-Go Support", icon: Smartphone },
    { value: "chat history analytics", label: "Chat History & Data Analytics", icon: BarChart },
    { value: "customizable chat widget", label: "Customizable Chat Widget for Branding", icon: MessageSquare },
    { value: "multi language support", label: "Multi-Language Support for Global Reach", icon: Globe },
    { value: "efficient stock management", label: "Efficient Stock Management & Tracking", icon: Package },
    { value: "real time inventory updates", label: "Real-Time Inventory Updates", icon: RefreshCw },
    { value: "low stock alerts", label: "Low Stock & Out-of-Stock Alerts", icon: Bell },
    { value: "detailed inventory reports", label: "Detailed Sales & Inventory Reports", icon: FileText },
    { value: "easy product categorization", label: "Easy Product Categorization & Filtering", icon: Layers },
    { value: "easy content updates", label: "Easily Add & Update Website Content Anytime", icon: Edit },
    { value: "no coding required", label: "No Coding Required for Content Changes", icon: FileCode },
    { value: "user friendly panel", label: "User-Friendly Panel for Managing Text, Images & Links", icon: Layout },
    { value: "real time website updates", label: "Real-Time Updates Without Rebuilding the Website", icon: Zap },
    { value: "seo friendly meta tags", label: "SEO-Friendly Approach with Editable Meta Tags", icon: Search },
    { value: "automated notifications", label: "Send Automated Messages & Notifications to Your Customers", icon: Bell },
    { value: "customizable messages", label: "Customize & Change Predefined Messages Anytime", icon: MessageCircle },
    { value: "whatsapp integration", label: "Directly Integrate WhatsApp Chat on Your Website", icon: MessageSquare },
    { value: "order updates", label: "Send Order Updates, Payment Confirmations & Reminders", icon: ShoppingBag },
    { value: "broadcast messages", label: "Broadcast Messages for Offers, Discounts & Announcements", icon: Share2 },
    { value: "customer engagement", label: "Improve Customer Engagement with Instant Communication", icon: Users },
    { value: "message analytics", label: "Track & Analyze Message Delivery & Response Rates", icon: BarChart },
    { value: "whatsapp cloud api", label: "WhatsApp Cloud API Integration", icon: Cloud },
    { value: "easy image management", label: "Easily Add, Update & Remove Images Anytime", icon: Image },
    { value: "no code changes", label: "No Need to Modify Website Code for Changes", icon: FileCode },
    { value: "user friendly panel", label: "User-Friendly Panel to Manage Images Effortlessly", icon: Layout },
    { value: "responsive gallery", label: "Fast & Responsive Gallery with Smooth Navigation", icon: Maximize },
    { value: "image categories", label: "Organize Images into Categories for Better Display", icon: Folder },
    { value: "seo friendly images", label: "SEO-Friendly Image Management for Better Visibility", icon: Search },
    { value: "optimized loading", label: "Lightweight & Optimized for Faster Loading", icon: Zap },
    { value: "fast loading", label: "Fast-Loading & Highly Optimized for Performance", icon: Zap },
    { value: "customized design", label: "Fully Customized Design to Match Your Brand", icon: Palette },
    { value: "seo friendly", label: "SEO-Friendly Structure for Better Search Rankings", icon: Search },
    { value: "responsive design", label: "Mobile & Tablet Responsive for All Devices", icon: Smartphone },
    { value: "unlimited pages", label: "Unlimited Pages – Add as Many as You Need", icon: Files },
    { value: "modify any content", label: "Modify Any Content Anywhere on Your Website", icon: Edit },
    { value: "update information", label: "Update Text, Images, Links & Other Information Easily", icon: FileText },
    { value: "file updates included", label: "Up to 20 File Updates Included in the Plan", icon: Files },
    { value: "quarterly updates", label: "Get Up to 4 Updates Every 3 Months", icon: Calendar },
    { value: "keep website fresh", label: "Keep Your Website Fresh & Relevant Without Redesigning", icon: RefreshCw },
    { value: "maintain seo", label: "Maintain SEO Performance with Updated Content", icon: TrendingUp },
    { value: "error free updates", label: "Ensure Smooth & Error-Free Updates Without Hassle", icon: CheckCircle },
    { value: "no extra charges", label: "No Extra Charges for Small Changes & Adjustments", icon: DollarSign },
    { value: "quarterly 12 updates", label: "Get Up to 12 Updates Every 3 Months", icon: Calendar },
    { value: "single request updates", label: "Up to 20 File Updates in a Single Request", icon: Files },
    { value: "one time update", label: "One-Time Update Without Any Recurring Plan", icon: Clock },
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