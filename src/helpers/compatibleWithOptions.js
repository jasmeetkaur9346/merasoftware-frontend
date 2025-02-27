import { CiGlobe } from "react-icons/ci";
import { GoDatabase } from "react-icons/go";
import { IoIosCloudDone } from "react-icons/io";
import { MdSmartphone } from "react-icons/md";

const compatibleWithOptions = [
  {
    value: "standard_websites",
    label: "Standard Websites",
    icon: CiGlobe
  },
  {
    value: "dynamic_websites",
    label: "Dynamic Websites",
    icon: GoDatabase
  },
  {
    value: "web_applications",
    label: "Cloud Softwares",
    icon: IoIosCloudDone
  },
  {
    value: "mobile_apps",
    label: "Mobile Apps",
    icon: MdSmartphone
  }
];

// Custom component for the option display
export const CustomCompatibleOption = ({ data, ...props }) => {
  const Icon = data.icon;
  
  return (
    <div className={`flex items-center p-2 ${props.isFocused ? 'bg-slate-100' : ''}`}>
      <Icon className="w-5 h-5 mr-2" />
      <span>{data.label}</span>
    </div>
  );
};

// Custom component for the selected value
export const CustomCompatibleValue = ({ data, ...props }) => {
  const Icon = data.icon;
  
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span>{data.label}</span>
    </div>
  );
};

export default compatibleWithOptions;