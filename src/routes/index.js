import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App"
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import Cancel from "../pages/Cancel";
import Success from "../pages/Success";
import OrderPage from "../pages/OrderPage";
import AllOrder from "../pages/AllOrder";
import AllCategory from "../pages/AllCategory";
import AllAds from "../pages/AllAds";
import WalletManagement from "../pages/WalletManagement";
import Profile from "../pages/Profile";
import AllDevelopers from "../pages/AllDevelopers";
import AdminProjects from "../pages/AdminProjects";
import ProjectDetails from "../pages/ProjectDetails";
import WalletDetails from "../pages/WalletDetails";
import ServiceCard from "../pages/ServiceCard";
import AllWelcomeContent from "../pages/AllWelcomeContent";
import AdminWebsiteUpdates from "../pages/AdminWebsiteUpdates";
import AdminUpdateRequests from "../pages/AdminUpdateRequests";
import UserUpdateDashboard from "../pages/UserUpdateDashboard";
import DeveloperUpdatePanel from "../pages/DeveloperUpdatePanel";
import AdminFileSettings from "../pages/AdminFileSettings";
import { useSelector } from "react-redux";
import UserDashboard from "../pages/UserDashboard";
import AdminPaymentVerification from "../pages/AdminPaymentVerification";
import AdminCouponPage from "../pages/AdminCouponPage";
import DirectPayment from "../pages/DirectPayment";
import ContactSupport from "../pages/ContactSupport";
import InstallmentPayment from "../pages/InstallmentPayment";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import CookiesPolicyPage from "../pages/CookiesPolicyPage";
import DeliveryPolicyPage from "../pages/DeliveryPolicyPage";
import RefundPolicyPage from "../pages/RefundPolicyPage";
import DisclaimersPage from "../pages/DisclaimersPage";
import DeveloperPanel from "../pages/DeveloperPanel";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import ContactUsForm from "../pages/ContactUsForm";
import AdminTicketsDashboard from "../pages/AdminTicketsDashboard";
import TicketDetail from "../pages/TicketDetail";
import ModernBusinessLandingPage from "../pages/ModernBusinessLandingPage";
import LandingPageLayout from "../pages/LandingPageLayout";
import AdminManagement from "../components/AdminManagement";
import DeveloperManagement from "../components/DeveloperManagement";
import PartnerManagement from "../components/PartnerManagement";
import CustomerManagement from "../components/CustomerManagement";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleBasedHome from "../components/RoleBasedHome";
import ManagerManagement from "../components/ManagerManagement";
import ManagerPanel from "../pages/ManagerPanel";
import HiddenProducts from "../pages/HiddenProducts";
import ManagerDashboard from "../pages/ManagerDashboard";
import PartnerPanel from "../pages/PartnerPanel";
import PartnerDashboard from "../pages/PartnerDashboard";
import PartnerCustomers from "../pages/PartnerCustomers";
import BusinessCreated from "../pages/BusinessCreated";
import FirstPurchaseList from "../pages/FirstPurchaseList";

// Create a conditional home route
// const HomeRoute = () => {
//     const user = useSelector(state => state?.user?.user);
    
//     if (user?._id) {
//       return <Navigate to="dashboard" />;
//     }
    
//     return <Home />;
//   };

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {
                path:"",
                element: <RoleBasedHome />
            },
            {
                path:"home",
                element: <Home />
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "unauthorized",
                element: <div>Unauthorized Access</div>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path : "product-category/",
                element : <CategoryProduct/>
            },
            {
                path : "product/:id",
                element : <ProductDetails/>
            },
            {
                path : "cart",
                element : <Cart/>
            },
            {
                path : "cancel",
                element : <Cancel/>
            },
            {
                path : "success",
                element : <Success/>
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path : "order",
                element : <OrderPage/>
            },
            {
                path : "order-detail/:orderId",
                element : <OrderDetailPage/>
            },
            {
                path : "profile",
                element : <Profile/>
            },
            {
                path : "project-details/:orderId",
                element : <ProjectDetails/>
            },
            {
                path : "wallet",
                element : <WalletDetails/>
            },
            {
                path: "/service-card",
                element : <ServiceCard/>
            },
            {
                path: "my-updates",
                element: <UserUpdateDashboard/>
            },
            {
                path: "dashboard",
                element: <UserDashboard/>
            },
            {
                path: "direct-payment",
                element: <DirectPayment/>
            },
            {
                path: "support",
                element : <ContactSupport/>
            },
            {
                path: "installment-payment/:orderId/:installmentNumber",
                element: <InstallmentPayment/>
            },
            {
                path: "terms-and-conditions",
                element: <TermsAndConditionsPage/>
            },
            {
                path: "privacy-policy",
                element : <PrivacyPolicyPage/>
            },
            {
                path: "cookies-policy",
                element : <CookiesPolicyPage/>
            },
            {
                path: "delivery-policy",
                element : <DeliveryPolicyPage/>
            },
            {
                path: "refund-policy",
                element : <RefundPolicyPage/>
            },
            {
                path: "disclaimers",
                element : <DisclaimersPage/>
            },
            {
                path: "contact-us",
                element: <ContactUsForm/>
            },
            {
                path: "support-tickets/:ticketId",
                element: <TicketDetail/>
            },
            {
                path: "admin-tickets/:ticketId",
                element: <TicketDetail isAdmin={true} />
            },
            {
                path: "admin-panel",
                element: (
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPanel/>
                    </ProtectedRoute>
                ),
                children :[
                    {
                        path: "",
                        element: <Navigate to="all-products" replace />
                    },
                    {
                        path: "all-products",
                        element : <AllProducts/>
                    },
                    {
                        path: "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path: "admins",
                        element : <AdminManagement/>
                    },
                    {
                        path: "managers",
                        element : <ManagerManagement/>
                    },
                    {
                        path: "developers",
                        element : <DeveloperManagement/>
                    },
                    {
                        path: "partners",
                        element : <PartnerManagement/>
                    },
                    {
                        path: "customers",
                        element : <CustomerManagement/>
                    },
                    {
                        path: "admin-settings",
                        element: <AdminFileSettings/>
                    },
                    {
                        path : "order-approval",
                        element : <AdminOrdersPage/>
                    },
                    {
                        path: "admin-tickets",
                        element: <AdminTicketsDashboard/>
                    },
                    {
                        path: "payment-verification",
                        element : <AdminPaymentVerification/>
                    },
                    {
                        path: "coupon-management",
                        element : <AdminCouponPage/>
                    },
                    {
                        path: "welcome-content",
                        element : <AllWelcomeContent/>
                    },
                    {
                        path: "update-requests",
                        element: <AdminUpdateRequests/>
                    },
                    {
                        path : "projects",
                        element : <AdminProjects/>
                    },
                    {
                        path: "website-updates",
                        element: <AdminWebsiteUpdates/>
                    },
                    {
                        path: "all-developers",
                        element : <AllDevelopers/>
                    },
                    {
                        path : "all-ads",
                        element : <AllAds/>
                    },
                    {
                        path: "all-categories",
                        element : <AllCategory/>
                    },
                    {
                        path: "all-orders",
                        element : <AllOrder/>
                    },
                    {
                        path : "wallet-management",
                        element : <WalletManagement/>
                    }
                ]
            },
            {
                path: "manager-panel",
                element: (
                    <ProtectedRoute allowedRoles={['manager']}>
                        <ManagerPanel/>
                    </ProtectedRoute>
                ),
                children :[
                    {
                        path: "",
                        element: <Navigate to="dashboard" replace />
                    },
                    {
                        path: "dashboard",
                        element : <ManagerDashboard/>
                    },
                    {
                        path: "all-products",
                        element : <AllProducts/>
                    },  
                    {
                        path : "all-ads",
                        element : <AllAds/>
                    },
                    {
                        path: "all-categories",
                        element : <AllCategory/>
                    },
                    {
                        path: "welcome-content",
                        element : <AllWelcomeContent/>
                    },
                    {
                        path: "hidden-products",
                        element : <HiddenProducts/>
                    },
                ]
            },
            {
                path: "partner-panel",
                element: (
                    <ProtectedRoute allowedRoles={['partner']}>
                        <PartnerDashboard/>
                    </ProtectedRoute>
                ),
                children :[
                    {
                        path: "",
                        element: <Navigate to="dashboard" replace />
                    },
                    {
                        path: "dashboard",
                        element : <PartnerDashboard/>
                    },
                    {
                    path: "partner-customers",
                    element : <PartnerCustomers/>
                    },
                    {
                    path: "business-created",
                    element : <BusinessCreated/>
                    },
                    {
                    path: "first-purchase-list",
                    element : <FirstPurchaseList/>
                    },
                ]
            },
            {
                path: "developer-panel",
                element : <DeveloperPanel/>,
                children :[
                    {
                        path: "developer-update-requests",
                        element : <DeveloperUpdatePanel/>
                    },
                ]
            }
        ]
    },
    {
        path: "/",
        element: <LandingPageLayout />,
        children: [
            {
                path: "landing",
                element: <ModernBusinessLandingPage />
            },
        ]
    },
])

export default router;