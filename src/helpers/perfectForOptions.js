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

import { 
  Store, 
  PackageOpen, 
  ShoppingCart, 
  Shirt, 
  Smartphone, 
  Sofa, 
  Scissors, } from 'lucide-react';
  import{
  Stethoscope, 
  GraduationCap, 
  Zap, 
  Wrench, 
  Home, 
  Dumbbell, 
  BadgePercent, 
  Package, 
  
  ShoppingBag, 
  Truck } from 'lucide-react';
  import {
  UtensilsCrossed, 
  Flower, 
  Activity, 
  BookOpen, 
  Video, 
  MonitorPlay, 
  Building, 
  Briefcase, 
  Recycle, 
  ListChecks, 
  HeartHandshake 
} from 'lucide-react';
import { RiFirstAidKitFill } from "react-icons/ri";
import { FaPills } from "react-icons/fa6";

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
  },
  {
    value: "retailers",
    label: "Retailers",
    icon: Store
  },
  {
    value: "wholesalers",
    label: "Wholesalers",
    icon: PackageOpen
  },
  {
    value: "grocery_stores",
    label: "Grocery Stores",
    icon: ShoppingCart
  },
  {
    value: "clothing_stores",
    label: "Clothing Stores",
    icon: Shirt
  },
  {
    value: "mobile_electronics_sellers",
    label: "Mobile & Electronics Sellers",
    icon: Smartphone
  },
  {
    value: "furniture_shops",
    label: "Furniture Shops",
    icon: Sofa
  },
  {
    value: "salons",
    label: "Salons",
    icon: Scissors
  },
  {
    value: "clinics",
    label: "Clinics",
    icon: Stethoscope
  },
  {
    value: "tutors",
    label: "Tutors",
    icon: GraduationCap
  },
  {
    value: "electricians",
    label: "Electricians",
    icon: Zap
  },
  {
    value: "mechanics",
    label: "Mechanics",
    icon: Wrench
  },
  {
    value: "home_service_providers",
    label: "Home Service Providers",
    icon: Home
  },
  {
    value: "personal_trainers",
    label: "Personal Trainers",
    icon: Dumbbell
  },
  {
    value: "shopkeepers",
    label: "Shopkeepers",
    icon: BadgePercent
  },
  {
    value: "warehouses",
    label: "Warehouses",
    icon: Package
  },
  {
    value: "medical_stores",
    label: "Medical Stores",
    icon: FaPills
  },
  {
    value: "supermarkets",
    label: "Supermarkets",
    icon: ShoppingBag
  },
  {
    value: "distributors",
    label: "Distributors",
    icon: Truck
  },
  {
    value: "food_vendors",
    label: "Food Vendors",
    icon: UtensilsCrossed
  },
  {
    value: "medicine_shops",
    label: "Medicine Shops",
    icon: RiFirstAidKitFill
  },
  {
    value: "florists",
    label: "Florists",
    icon: Flower
  },
  {
    value: "small_businesses",
    label: "Small Businesses",
    icon: Store
  },
  {
    value: "gyms",
    label: "Gyms",
    icon: Activity
  },
  {
    value: "coaching_centers",
    label: "Coaching Centers",
    icon: BookOpen
  },
  {
    value: "digital_content_creators",
    label: "Digital Content Creators",
    icon: Video
  },
  {
    value: "online_learning_platforms",
    label: "Online Learning Platforms",
    icon: MonitorPlay
  },
  {
    value: "real_estate_agents",
    label: "Real Estate Agents",
    icon: Building
  },
  {
    value: "job_consultants",
    label: "Job Consultants",
    icon: Briefcase
  },
  {
    value: "second_hand_goods_sellers",
    label: "Second-Hand Goods Sellers",
    icon: Recycle
  },
  {
    value: "business_directories",
    label: "Business Directories",
    icon: ListChecks
  },
  {
    value: "service_providers",
    label: "Service Providers",
    icon: HeartHandshake
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