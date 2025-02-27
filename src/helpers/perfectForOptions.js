// perfectForOptions.js
import { 
  FaBriefcase, 
  FaUserCircle, 
  FaUsers, 
  FaBuilding, 
  FaPlane, 
  FaGraduationCap, 
  FaSchool, 
  FaBook, 
  FaUtensils,
  FaCoffee,
  FaStore,
  FaHatChef,
  FaShoppingBag,
  FaTruck,
} from 'react-icons/fa';

import {
  MdBusiness,
  MdSchool,
  MdComputer,
  MdPerson,
  MdMenuBook,
  MdLanguage
} from 'react-icons/md';
import { PiBowlFoodLight } from "react-icons/pi";

const perfectForOptions = [
  { 
    value: "professional portfolios", 
    label: "Professional Portfolios",
    icon: FaBriefcase
  },
  { 
    value: "personal branding", 
    label: "Personal Branding",
    icon: FaUserCircle
  },
  { 
    value: "job seekers", 
    label: "Job Seekers",
    icon: FaUsers
  },
  { 
    value: "freelancers", 
    label: "Freelancers",
    icon: FaUserCircle
  },
  { 
    value: "entrepreneurs", 
    label: "Entrepreneurs",
    icon: MdBusiness
  },
  { 
    value: "immigration consultants", 
    label: "Immigration Consultants",
    icon: FaPlane
  },
  { 
    value: "travel agencies", 
    label: "Travel Agencies",
    icon: FaPlane
  },
  { 
    value: "visa service providers", 
    label: "Visa Service Providers",
    icon: FaPlane
  },
  { 
    value: "study abroad consultants", 
    label: "Study Abroad Consultants",
    icon: FaGraduationCap
  },
  { 
    value: "corporate travel management companies", 
    label: "Corporate Travel Management Companies",
    icon: FaBuilding
  },
  { 
    value: "tour operators", 
    label: "Tour Operators",
    icon: FaPlane
  },
  { 
    value: "relocation companies", 
    label: "Relocation Companies",
    icon: FaTruck
  },
  { 
    value: "travel insurance providers", 
    label: "Travel Insurance Providers",
    icon: FaBriefcase
  },
  { 
    value: "event travel services", 
    label: "Event Travel Services",
    icon: FaPlane
  },
  { 
    value: "small restaurants", 
    label: "Small Restaurants",
    icon: FaUtensils
  },
  { 
    value: "cafes", 
    label: "Cafes",
    icon: FaCoffee
  },
  { 
    value: "indian dhabas", 
    label: "Indian Dhabas",
    icon: FaUtensils
  },
  { 
    value: "cloud kitchens", 
    label: "Cloud Kitchens",
    icon: FaUtensils
  },
  { 
    value: "food chains", 
    label: "Food Chains",
    icon: FaStore
  },
  { 
    value: "fast food outlets", 
    label: "Fast Food Outlets",
    icon: FaShoppingBag
  },
  { 
    value: "food delivery services", 
    label: "Food Delivery Services",
    icon: FaTruck
  },
  { 
    value: "street food vendors", 
    label: "Street Food Vendors",
    icon: PiBowlFoodLight
  },
  { 
    value: "schools and colleges", 
    label: "Schools and Colleges",
    icon: FaSchool
  },
  { 
    value: "universities", 
    label: "Universities",
    icon: MdSchool
  },
  { 
    value: "e-learning platforms", 
    label: "E-learning Platforms",
    icon: MdComputer
  },
  { 
    value: "coaching institutes", 
    label: "Coaching Institutes",
    icon: FaBook
  },
  { 
    value: "tutors and trainers", 
    label: "Tutors and Trainers",
    icon: MdPerson
  },
  { 
    value: "skill development centers", 
    label: "Skill Development Centers",
    icon: FaBuilding
  },
  { 
    value: "corporate training programs", 
    label: "Corporate Training Programs",
    icon: FaBriefcase
  },
  { 
    value: "language learning services", 
    label: "Language Learning Services",
    icon: MdLanguage
  },
  { 
    value: "exam preparation platforms", 
    label: "Exam Preparation Platforms",
    icon: MdMenuBook
  },
  { 
    value: "education consultants", 
    label: "Education Consultants",
    icon: FaBriefcase
  }
];

export default perfectForOptions;

// Custom components for Select
export const CustomPerfectForOption = ({ data, ...props }) => {
  const Icon = data.icon;
  return (
    <div 
      className={`flex items-center gap-2 p-2 ${props.isFocused ? 'bg-slate-100' : ''}`}
      {...props.innerProps}
    >
      {Icon && <Icon size={18} />}
      <span>{data.label}</span>
    </div>
  );
};

export const CustomPerfectForValue = ({ data }) => {
  const Icon = data.icon;
  return (
    <div className="flex items-center gap-1">
      {Icon && <Icon size={14} />}
      <span>{data.label}</span>
    </div>
  );
};