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
import InstallmentManagement from "../pages/InstallmentManagement";
import InstallmentPayment from "../pages/InstallmentPayment";


// Create a conditional home route
const HomeRoute = () => {
    const user = useSelector(state => state?.user?.user);
    
    // If user is logged in, redirect to dashboard
    if (user?._id) {
      return <Navigate to="dashboard" />;
    }
    
    // Otherwise, show the normal home page
    return <Home />;
  };

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {
                path:"start-new-project",
                element: <Home />
            },
            {
                path:"",
                element: <HomeRoute />
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "sign-up",
                element : <SignUp/>
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
                path: "developer-updates",
                element: <DeveloperUpdatePanel/>
            },
            {
                path: "direct-payment",
                element: <DirectPayment/>
            },
            {
                path: "installments",
                element : <InstallmentManagement/>
            },
            {
                path: "installment-payment/:orderId/:installmentNumber",
                element: <InstallmentPayment/>
            },
            {
                path: "admin-panel",
                element : <AdminPanel/>,
                children :[
                    {
                        path: "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path: "admin-settings",
                        element: <AdminFileSettings/>
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
                        path: "all-products",
                        element : <AllProducts/>
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
        ]
    }
])

export default router;