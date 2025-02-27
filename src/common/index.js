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
        }
    }
}

export default SummaryApi;