import { LuImagePlus } from "react-icons/lu";
import { LuLayers } from "react-icons/lu";
import { LuHardDrive } from "react-icons/lu";
import { Users, Activity, ShieldCheck, BarChart3, Lock, Users2, CreditCard, Wallet, BarChart2, Plug, MessageCircle, Zap, History, Bot, PackageSearch, Bell, Tags, Map, BarChart, Layout, PenTool, MousePointer, Code, Settings, DollarSign, Calculator, BookOpen, FileText, UsersRound, MessageSquare, Share2 } from 'lucide-react';

const keyBenefitsOptions = [
  {
    value: "complete_control",
    label: "Complete Control",
    description: "Manage your gallery content with ease",
    icon: LuImagePlus
  },
  {
    value: "custom_design",
    label: "Custom Design",
    description: "Matches your website's theme",
    icon: LuLayers
  },
  {
    value: "flexible_storage",
    label: "Flexible Storage",
    description: "Based on your storage plan",
    icon: LuHardDrive
  },
  {
    value: "create_and_delete_users",
    label: "Create and Delete users",
    description: "Manage users effortlessly",
    icon: Users
  },
  {
    value: "track_activities",
    label: "Track Activities",
    description: "Monitor user activities and work progress",
    icon: Activity
  },
  {
    value: "access_control",
    label: "Access Control",
    description: "Assign different access levels and roles",
    icon: ShieldCheck
  },
  {
    value: "workload_management",
    label: "Workload Management",
    description: "Improve workload distribution and efficiency",
    icon: BarChart3
  },
  {
    value: "secure_management",
    label: "Secure Management",
    description: "Ensure structured and secure user management",
    icon: Lock
  },
  {
    value: "team_collaboration",
    label: "Team Collaboration",
    description: "Enhance team collaboration and accountability",
    icon: Users2
  },
  {
    value: "secure_transactions",
    label: "Secure Transactions",
    description: "Secure and seamless online transactions",
    icon: CreditCard
  },
  {
    value: "multiple_payment_methods",
    label: "Multiple Payment Methods",
    description: "Supports UPI, Cards, and Net Banking",
    icon: Wallet
  },
  {
    value: "transaction_tracking",
    label: "Transaction Tracking",
    description: "Automated transaction tracking and reports",
    icon: BarChart2
  },
  {
    value: "fraud_protection",
    label: "Fraud Protection",
    description: "Advanced fraud detection and security features",
    icon: ShieldCheck
  },
  {
    value: "easy_integration",
    label: "Easy Integration",
    description: "Simple integration with existing platforms",
    icon: Plug
  },
  {
    value: "real_time_support",
    label: "Real-time Support",
    description: "Real-time customer support and engagement",
    icon: MessageCircle
  },
  {
    value: "instant_resolution",
    label: "Instant Resolution",
    description: "Instant query resolution for better customer experience",
    icon: Zap
  },
  {
    value: "chat_history",
    label: "Chat History",
    description: "Chat history and user tracking for better service",
    icon: History
  },
  {
    value: "24/7_chatbot",
    label: "24/7 Chatbot",
    description: "Automated chatbot support for 24/7 availability",
    icon: Bot
  },
  {
    value: "chat_support",
    label: "Chat Support",
    description: "Multi-user chat support for team collaboration",
    icon: Users
  },
  {
    value: "stock_management",
    label: "Stock Management",
    description: "Track and manage stock levels efficiently",
    icon: PackageSearch
  },
  {
    value: "stock_alerts",
    label: "Stock Alerts",
    description: "Automated stock updates and alerts",
    icon: Bell
  },
  {
    value: "product_organization",
    label: "Product Organization",
    description: "Easy product categorization and search",
    icon: Tags
  },
  {
    value: "multi_location_tracking",
    label: "Multi-location Tracking",
    description: "Multi-location inventory tracking",
    icon: Map
  },
  {
    value: "business_insights",
    label: "Business Insights",
    description: "Generate reports for better business insights",
    icon: BarChart 
  },
  {
    value: "dynamic_panel",
    label: "Dynamic Panel",
    description: "Integrated dynamic panel for easy page updates",
    icon: Layout 
  },
  {
    value: "content_modification",
    label: "Content Modification",
    description: "Modify content based on page type",
    icon: PenTool 
  },
  {
    value: "user_friendly_interface",
    label: "User-Friendly Interface",
    description: "User-friendly interface for quick changes",
    icon: MousePointer 
  },
  {
    value: "no_code_updates",
    label: "No-Code Updates",
    description: "No coding required for updates",
    icon: Code 
  },
  {
    value: "flexible_customization",
    label: "Flexible Customization",
    description: "Improves website flexibility and customization",
    icon: Settings  
  },
  {
    value: "transaction_management",
    label: "Transaction Management",
    description: "Record and manage financial transactions effortlessly",
    icon: DollarSign  
  },
  {
    value: "automated_calculations",
    label: "Automated Calculations",
    description: "Automated balance calculation for accuracy",
    icon: Calculator  
  },
  {
    value: "digital_ledger",
    label: "Digital Ledger",
    description: "Secure and organized ledger system",
    icon: BookOpen  
  },
  {
    value: "financial_reports",
    label: "Financial Reports",
    description: "Generate reports for better financial tracking",
    icon: FileText  
  },
  {
    value: "role_based_access",
    label: "Role-based Access",
    description: "Multi-user access with role-based permissions",
    icon: UsersRound   
  },
  {
    value: "automated_messaging",
    label: "Automated Messaging",
    description: "Send automated messages directly from the website",
    icon: MessageSquare   
  },
  {
    value: "quick_response",
    label: "Quick Response",
    description: "Improve customer engagement and response time",
    icon: Zap   
  },
  {
    value: "whatsApp_integration",
    label: "WhatsApp Integration",
    description: "Seamless integration with WhatsApp API",
    icon: Share2   
  },
  {
    value: "message_templates",
    label: "Message Templates",
    description: "Supports personalized messaging and templates",
    icon: FileText   
  },
];

// Custom component for the option display
export const CustomKeyBenefitOption = ({ data, ...props }) => {
  const Icon = data.icon;
  
  return (
    <div className={`flex items-center p-2 ${props.isFocused ? 'bg-slate-100' : ''}`}>
      <Icon className="w-5 h-5 mr-2" />
      <div>
        <div className="font-medium">{data.label}</div>
        <div className="text-sm text-gray-600">{data.description}</div>
      </div>
    </div>
  );
};

// Custom component for the selected value
export const CustomKeyBenefitValue = ({ data, ...props }) => {
  const Icon = data.icon;
  
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span>{data.label}</span>
    </div>
  );
};

export default keyBenefitsOptions;