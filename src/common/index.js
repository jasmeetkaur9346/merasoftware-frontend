const backendDomain = process.env.REACT_APP_BACKEND_URL //"http://localhost:8080"

const SummaryApi = {
    signUP : {
        url : `${backendDomain}/api/signup`,
        method: "post"
    },
    signIn : {
       url : `${backendDomain}/api/signin`,
        method: "post"
    },
    verifyOtp:{
      url : `${backendDomain}/api/verify-otp`,
      method: "post"
    },
    resendOtp: {
      url: `${backendDomain}/api/resend-otp`,
      method: "post"
    },
    current_user : {
        url : `${backendDomain}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : "get"
    },
    allUser :{
        url : `${backendDomain}/api/all-user`,
        method : "get"
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomain}/api/upload-product`,
        method : "post"
    },
    allProduct : {
        url : `${backendDomain}/api/get-product`,
        method : "get"
    },
    getAllProducts: {
      url : `${backendDomain}/api/all-products`,
      method : "get"
    },
    updateProduct : {
        url : `${backendDomain}/api/update-product`,
        method : "post"
    },
    deleteProduct : {
        url : `${backendDomain}/api/delete-product`,
        method : "delete" 
    },
    categoryProduct : {
        url : `${backendDomain}/api/get-categoryProduct`,
        method : "get"
    },
    categoryWiseProduct : {
        url : `${backendDomain}/api/category-product`,
        method : "post"
    },
    productDetails : {
        url : `${backendDomain}/api/product-details`,
        method : "post"
    },
    addToCartProduct : {
        url : `${backendDomain}/api/addtocart`,
        method : "post"
    },
    addToCartProductCount : {
        url : `${backendDomain}/api/countAddToCartProduct`,
        method : "get"
    },
    addToCartProductView : {
        url : `${backendDomain}/api/view-card-product`,
        method : "get"
    },
    updateCartProduct : {
        url : `${backendDomain}/api/update-cart-product`,
        method : "post"
    },
    deleteCartProduct : {
        url : `${backendDomain}/api/delete-cart-product`,
        method : "post"
    },
    searchProduct : {
        url : `${backendDomain}/api/search`,
        method : "get"
    },
    filterProduct : {
        url : `${backendDomain}/api/filter-product`,
        method : "post"
    },
    payment : {
        url : `${backendDomain}/api/checkout`,
        method : "post"
    },
    getOrder : {
        url : `${backendDomain}/api/order-list`,
        method : "get"
    },
    allOrder : {
        url : `${backendDomain}/api/all-order`,
        method : "get"
    },
    uploadCategory : {
        url : `${backendDomain}/api/upload-category`,
        method : "post"
    },
    allCategory : {
        url : `${backendDomain}/api/get-categories`,
        method : "get"
    },
    updateCategory : {
        url: `${backendDomain}/api/update-category`,
        method : "post"
    },
    deleteCategory : {
        url : `${backendDomain}/api/delete-category`,
        method: "delete"
    },
    getCompatibleFeatures:{
        url: `${backendDomain}/api/compatible-features`,
        method: "get"
    },
    uploadAd : {
        url : `${backendDomain}/api/upload-ad`,
        method : "post"
    },
    uploadBanner : {
        url : `${backendDomain}/api/upload-banner`,
        method : "post"
    },
    allBanner : {
        url : `${backendDomain}/api/get-banner`,
        method : "get"
    },
    updateBanner : {
        url : `${backendDomain}/api/update-banner`,
        method : "post"
    },
    deleteBanner : {
        url : `${backendDomain}/api/delete-banner`,
        method : "delete"
    },
    updateProfile : {
        url : `${backendDomain}/api/update-profile`,
        method : "post"
    },
    uploadDeveloper : {
        url: `${backendDomain}/api/upload-developer`,
        method: "post"
    },
    allDevelopers:{
        url: `${backendDomain}/api/get-developer`,
        method: "get"
    },
    editDeveloper: {
        url : `${backendDomain}/api/edit-developer`,
        method: "post"
    },
    getSingleDeveloper: {
        url: `${backendDomain}/api/get-single-developer`,
        method : "get"
    },
    assignDeveloper:{
        url: `${backendDomain}/api/assign-developer`,
        method: "post"
    },
    createOrder : {
        url : `${backendDomain}/api/create-order`,
        method: "post"
    },
    ordersList : {
        url : `${backendDomain}/api/get-order`,
        method: "get"
    },
    orderDetails: {
        url : `${backendDomain}/api/order-details`,
        method: "get"
    },
    deleteOrder: {
        url: `${backendDomain}/api/delete-order`,
        method: "delete"
    },
    validateUpdatePlan: {
        url : `${backendDomain}/api/validate-update-plan`,
        method: "post"
    },
    toggleUpdatePlan: {
        url : `${backendDomain}/api/toggle-update-plan`,
        method: "post"
    },
    adminProjects : {
        url : `${backendDomain}/api/get-projects`,
        method : "get"
    },
    updateProjectProgress: {
        url : `${backendDomain}/api/update-project-progress`,
        method: "post"
    },
    adminUpdatePlans : {
        url: `${backendDomain}/api/get-update-plans`,
        method: "get"
    },
    updatePlanProgress: {
        url: `${backendDomain}/api/update-plan-progress`,
        method: "post"
    },
    sendProjectMessage: {
        url : `${backendDomain}/api/project-message`,
        method : "post"
    },
    updateProjectLink:{
      url : `${backendDomain}/api/update-project-link`,
      method: "post"
    },
    guestSlides: {
        url: `${backendDomain}/api/get-guest-slides`,
        method: "get"
      },
      userWelcome: {
        url: `${backendDomain}/api/get-user-welcome`,
        method: "get"
      },
      uploadGuestSlides: {
        url: `${backendDomain}/api/upload-guest-slides`,
        method: "post"
      },
      updateGuestSlides:{
        url : `${backendDomain}/api/update-guest-slides`,
        method: "post"
      },
      deleteGuestSlides: {
        url: `${backendDomain}/api/delete-guest-slides`,
        method: "delete"
      },
      uploadUserWelcome: {
        url: `${backendDomain}/api/upload-user-welcome`,
        method: "post"
      },
      updateUserWelcome: {
        url: `${backendDomain}/api/update-user-welcome`,
        method: "post"
      },
      deleteUserWelcome: {
        url: `${backendDomain}/api/delete-user-welcome`,
        method: "delete"
      },
      userUpdatePlans:{
        url: `${backendDomain}/api/user-update-plans`,
        method: "get"
      },
      requestUpdate: {
        url: `${backendDomain}/api/user-request-update`,
        method: "post"
      },
      userUpdateRequests : {
        url : `${backendDomain}/api/get-update-requests`,
        method: "get"
      },
      adminUpdateRequests: {
        url: `${backendDomain}/api/get-admin-update-requests`,
        method: "get"
      },
      assignUpdateRequestDeveloper: {
        url : `${backendDomain}/api/assign-update-developer`,
        method: "post"
      },
      updateRequestMessage: {
        url: `${backendDomain}/api/update-request-message`,
        method: "post"
      },
      completeUpdateRequest: {
        url: `${backendDomain}/api/complete-update-request`,
        method: "post"
      },
      rejectUpdateRequest: {
        url : `${backendDomain}/api/reject-update-request`,
        method: "post"
      },
      developerAssignedUpdates: {
        url: `${backendDomain}/api/assigned-updates`,
        method: "get"
      },
      developerUpdateMessage :{
        url: `${backendDomain}/api/developer-update-message`,
        method: "post"
      },
      addDeveloperNote: {
        url : `${backendDomain}/api/developer-add-note`,
        method: "post"
      },
      completeDeveloperUpdate :{
        url : `${backendDomain}/api/developer-complete-update`,
        method: "post"
      },
      getAdminUpdateSettings: {
        url: `${backendDomain}/api/get-file-settings`,
        method: "get"
      },
      adminUpdateSettings: {
        url : `${backendDomain}/api/update-file-settings`,
        method: "post"
      },
      downloadAllFiles:{
        url: `${backendDomain}/api/download-all-files/:requestId`,
        method: "get"
      },
      validateCoupon: {
        url : `${backendDomain}/api/validate-coupon`,
        method: "post"
      },
      getAllCoupons: {
        url: `${backendDomain}/api/get-coupons`,
        method: "get"
      },
      createCoupon: {
        url: `${backendDomain}/api/create-coupon`,
        method: "post"
      },
      updateCoupon: {
        url: `${backendDomain}/api/update-coupon`,
        method: "post"
      },
      deleteCoupon : {
        url: `${backendDomain}/api/delete-coupon`,
        method: "delete"
      },
      getProductsForCoupon : {
        url: `${backendDomain}/api/products-coupon`,
        method: "get"
      },
      payInstallment: {
        url: `${backendDomain}/api/pay-installment`,
        method: "post"
      },
      markInstallmentVerificationPending: {
        url: `${backendDomain}/api/mark-installment-pending`,
        method: "post"
      },
      checkPendingOrderTransactions:{
        url: `${backendDomain}/api/check-pending-order-transactions`,
        method :"get"
      },
      getAdminNotifications: {
        url: `${backendDomain}/api/admin-notifications`,
        method: "get"
      },
      markNotificationRead: {
        url: `${backendDomain}/api/mark-notification-read`,
        method: "post"
      },
      getUserNotifications: {
        url: `${backendDomain}/api/user-notifications`,
        method: "get"
      },
      getDeveloperNotifications: {
        url: `${backendDomain}/api/developer-notifications`,
        method: "get"
      },
      pendingOrders: {
        url : `${backendDomain}/api/pending-orders`,
        method: "get"
      },
      approveOrder: {
        url : `${backendDomain}/api/approve-order`,
        method: "post"
      },
      rejectOrder: {
        url : `${backendDomain}/api/reject-order`,
        method: "post"
      },
      downloadInvoice:{
        url : `${backendDomain}/api/download-invoice`,
        method: "get"
      },
      contactUs: {
        url : `${backendDomain}/api/contact-us`,
        method: "post"
      },
      createTicket: {
        url : `${backendDomain}/api/create-ticket`,
        method: "post"
      },
      getUserTickets: {
        url : `${backendDomain}/api/get-user-tickets`,
        method: "get"
      },
      getTicketDetails: {
        url : `${backendDomain}/api/get-ticket-details`,
        method: "get"
      },
      replyTicket: {
        url : `${backendDomain}/api/ticket-reply`,
        method: "post"
      },
      closeTicket: {
        url : `${backendDomain}/api/ticket-close`,
        method: "post"
      },
      getAllTickets: {
        url : `${backendDomain}/api/get-all-tickets`,
        method: "get"
      },
      getGeneralUsers: {
         url: `${backendDomain}/api/general-users`,
         method: "get"
      },
      addRoleToUser: {
        url: `${backendDomain}/api/addRole`,
        method: "post"
      },
      hideProduct: {
        url: `${backendDomain}/api/hide-product`,
        method: "post"
      },
      UnhideProduct: {
        url: `${backendDomain}/api/unhide-product`,
        method: "post"
      },
      getHiddenProducts: {
        url: `${backendDomain}/api/get-hidden-products`,
        method: "get"
      },
      userRoleSwitch: {
        url: `${backendDomain}/api/role-switch`,
        method: "post"
      },
    wallet : {
        balance :{
            url : `${backendDomain}/api/wallet/balance`,
            method: "get"
        },
        addBalance: {
            url : `${backendDomain}/api/wallet/add-balance`,
            method: "post"
        },
        deduct : {
            url : `${backendDomain}/api/wallet/deduct`,
            method : "post"
        },
        history : {
            url : `${backendDomain}/api/wallet/history`,
            method : "get"
        },
        verifyPayment: {
            url: `${backendDomain}/api/wallet/verify-payment`,
            method: "post"
        },
        pendingTransactions: {
            url : `${backendDomain}/api/wallet/pending-transactions`,
            method: "get"
        },
        approveTransaction: {
            url: `${backendDomain}/api/wallet/approve-transaction`,
            method: "post"
        },
        rejectTransaction: {
            url: `${backendDomain}/api/wallet/reject-transaction`,
            method: "post"
        },
        adminTransactionHistory: {
            url: `${backendDomain}/api/wallet/admin-transaction-history`,
            method: "get"
        }
    }
}

export default SummaryApi;