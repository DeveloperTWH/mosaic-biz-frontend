module.exports = {

"[project]/app/(home)/partners/business/new/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CreateNewBusinessPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const initialForm = {
    businessName: '',
    description: '',
    email: '',
    phoneNumber: '',
    listingType: '',
    address: '',
    city: '',
    state: '',
    country: '',
    logo: null,
    coverImage: null
};
function CreateNewBusinessPage() {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialForm);
    const [plans, setPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPlanId, setSelectedPlanId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pageLoading, setPageLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [userSubscriptions, setUserSubscriptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTab, setSelectedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("new"); // "new" or "existing"
    const [selectedCategories, setSelectedCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [productCategories, setProductCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [serviceCategories, setServiceCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [foodCategories, setFoodCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchCategories = async ()=>{
            try {
                const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/categories`);
                const data = await response.json();
                console.log(data);
                // Check if the API response contains valid data fields
                if (response.ok && data?.success === true && data?.data) {
                    // Store categories based on listingType
                    setProductCategories(data.data.productCategories);
                    setServiceCategories(data.data.serviceCategories);
                    setFoodCategories(data.data.foodCategories);
                    // Default to one of the categories or empty
                    setCategories([]);
                } else {
                    console.log('Error fetching categories: Invalid response structure');
                    throw new Error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally{
                setPageLoading(false); // Set pageLoading to false after fetch
            }
        };
        if (formData.listingType) {
            fetchCategories(); // Fetch categories only when listingType is selected
        }
    }, [
        formData.listingType
    ]); // Dependency on listingType
    const handleListingTypeChange = (e)=>{
        setFormData({
            ...formData,
            listingType: e.target.value
        });
    };
    const getCategoriesForListingType = ()=>{
        if (formData.listingType === 'product') {
            return productCategories;
        } else if (formData.listingType === 'service') {
            return serviceCategories;
        } else if (formData.listingType === 'food') {
            return foodCategories;
        } else {
            return []; // Return empty if no valid listingType is selected
        }
    };
    ;
    // Only run once on component mount
    const handleCategoryChange = (e)=>{
        const selectedOptionId = e.target.value;
        // Find the category object from the available categories based on the selected ID
        const selectedCategory = getCategoriesForListingType().find((category)=>category._id === selectedOptionId);
        if (selectedCategory && !selectedCategories.some((category)=>category._id === selectedCategory._id) && selectedCategories.length < 5) {
            setSelectedCategories([
                ...selectedCategories,
                selectedCategory
            ]);
        }
    };
    const handleRemoveCategory = (category)=>{
        setSelectedCategories(selectedCategories.filter((cat)=>cat._id !== category._id));
    };
    // Filter categories to remove the ones that are already selected
    const availableCategories = categories.filter((item)=>!selectedCategories.some((selectedCategory)=>selectedCategory._id === item._id));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchPlans = async ()=>{
            try {
                const res = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/subscription-plans`);
                const data = await res.json();
                // Check if the response is ok and the data is an array
                if (res.ok && Array.isArray(data.data)) {
                    // Set the fetched plans and select the plan with the lowest price
                    setPlans(data.data);
                    setSelectedPlanId(data.data.sort((a, b)=>a.price - b.price)[0]._id);
                } else {
                    console.log('Error: Invalid response data');
                    throw new Error('Failed to fetch subscription plans');
                }
                const userSubscriptionRes = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/user/subscriptions`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const userSubscriptionData = await userSubscriptionRes.json();
                if (userSubscriptionRes.ok && Array.isArray(userSubscriptionData.subscriptions)) {
                    console.log(userSubscriptionData.subscriptions);
                    setUserSubscriptions(userSubscriptionData.subscriptions);
                } else {
                    console.log('No subscriptions found for the user');
                }
            } catch (error) {
                console.error('Error fetching subscription plans:', error);
                // Fallback to dummy data
                const dummy = [
                    {
                        _id: '685281f61e1de765d6b297c0',
                        name: 'Basic',
                        price: 100,
                        durationInDays: 30,
                        limits: {
                            productListings: 3,
                            serviceListings: 1,
                            foodListings: 1,
                            imageLimit: 3,
                            videoLimit: 0
                        },
                        features: {
                            analyticsDashboard: false,
                            supportLevel: 'basic'
                        }
                    },
                    {
                        _id: '685281f61e1de765d6b297c1',
                        name: 'Pro',
                        price: 499,
                        durationInDays: 90,
                        limits: {
                            productListings: 10,
                            serviceListings: 5,
                            foodListings: 2,
                            imageLimit: 6,
                            videoLimit: 1
                        },
                        features: {
                            analyticsDashboard: true,
                            supportLevel: 'standard',
                            marketingTools: true
                        }
                    },
                    {
                        _id: '685281f61e1de765d6b297c2',
                        name: 'Pro Plus',
                        price: 999,
                        durationInDays: 180,
                        limits: {
                            productListings: 20,
                            serviceListings: 10,
                            foodListings: 5,
                            imageLimit: 10,
                            videoLimit: 3
                        },
                        features: {
                            analyticsDashboard: true,
                            supportLevel: 'priority',
                            marketingTools: true,
                            aiRecommendation: true
                        }
                    }
                ];
                // Set the fallback dummy data and select the first plan as default
                setPlans(dummy);
                setSelectedPlanId(dummy[0]._id);
            } finally{
                setPageLoading(false); // Set pageLoading to false after fetch
            }
        };
        fetchPlans();
    }, []);
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleFileChange = (e)=>{
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData((prev)=>({
                    ...prev,
                    [name]: files[0]
                }));
        }
    };
    // const handleSubmit = async () => {
    //   setLoading(true);
    //   try {
    //     const body = new FormData();
    //     Object.entries(formData).forEach(([key, value]) => {
    //       if (value) body.append(key, value);
    //     });
    //     body.append('subscriptionPlanId', selectedPlanId);
    //     body.append('paymentId', 'TechwareHut12342');
    //     body.append('paymentStatus', 'COMPLETED');
    //     body.append('isApproved', 'true');
    //     console.log(body);
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business`, {
    //       method: 'POST',
    //       body,
    //       credentials: 'include',
    //     });
    //     const data = await res.json();
    //     if (res.ok) {
    //       toast.success('Business registered successfully!');
    //       setTimeout(() => {
    //         window.location.href = '/partners';
    //       }, 2000);
    //     } else {
    //       toast.error(data.message || 'Something went wrong');
    //     }
    //   } catch {
    //      toast.error('Network error');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const handleSubmit = async ()=>{
        setLoading(true);
        // setPageLoading(true);
        try {
            if (formData.listingType === 'product') {
                // Extract only the _id from selectedCategories for the backend
                formData.productCategories = selectedCategories.map((category)=>category._id);
            } else if (formData.listingType === 'service') {
                formData.serviceCategories = selectedCategories.map((category)=>category._id);
            } else if (formData.listingType === 'food') {
                formData.foodCategories = selectedCategories.map((category)=>category._id);
            }
            // ➤ 1. Save Business Draft
            const draftRes = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/business/draft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    businessName: formData.businessName,
                    email: formData.email,
                    subscriptionPlanId: selectedPlanId,
                    formData
                })
            });
            const draftData = await draftRes.json();
            if (!draftRes.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(draftData.message || 'Draft creation failed');
                setLoading(false);
                return;
            }
            const draftId = draftData.draftId;
            // ➤ 2. Create Stripe Checkout Session
            const stripeRes = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    draftId
                })
            });
            const stripeData = await stripeRes.json();
            if (!stripeRes.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(stripeData.message || 'Failed to create payment session');
                setLoading(false);
                return;
            }
            // ➤ 3. Redirect to Stripe
            window.location.href = stripeData.sessionUrl;
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Something went wrong. Please try again.');
        } finally{
            setLoading(false);
        }
    };
    const handleBusinessCreation = async ()=>{
        if (selectedPlanId) {
            setLoading(true);
            try {
                const categoryIds = selectedCategories.map((category)=>category._id);
                if (formData.listingType === 'product') {
                    formData.productCategories = categoryIds;
                } else if (formData.listingType === 'service') {
                    formData.serviceCategories = categoryIds;
                } else if (formData.listingType === 'food') {
                    formData.foodCategories = categoryIds;
                }
                const res = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/business/retry-create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        subscriptionId: selectedPlanId,
                        businessName: formData.businessName,
                        formData
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Business created successfully!');
                    // Redirect or show success message
                    window.location.href = 'http://localhost:3000/partners';
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(data.message || 'Error creating business');
                }
            } catch (error) {
                console.error(error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Network error, please try again.');
            } finally{
                setLoading(false);
            }
        }
    };
    const Loader = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center w-full h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"
            }, void 0, false, {
                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
            lineNumber: 397,
            columnNumber: 5
        }, this);
    if (pageLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Loader, {}, void 0, false, {
            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
            lineNumber: 403,
            columnNumber: 12
        }, this); // Show loader until everything is loaded
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen px-4 py-10 bg-white sm:px-6 md:px-10 lg:px-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-10 lg:flex-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex justify-center h-auto sm:h-[500px] lg:h-[710px] pt-2 sm:pt-10 lg:w-1/2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-[-10px] left-[-20px] w-[60%] sm:w-[70%] lg:w-[60%] h-[60%] sm:h-[70%] lg:h-[60%] bg-custom-yellow z-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 413,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/partners/registration-image.png",
                                    alt: "Business Registration",
                                    width: 500,
                                    height: 480,
                                    className: "relative z-10 object-contain w-full h-auto rounded-lg shadow"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 414,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                            lineNumber: 412,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full lg:w-1/2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "mb-4 text-2xl font-semibold uppercase sm:text-3xl md:text-4xl heading",
                                    children: "BUSINESS REGISTRATION"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 426,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                    className: "h-[2px] w-[100px] bg-green-900"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 429,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                    className: "h-[2px] w-[100px] bg-green-900 mt-[1px]"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 430,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 gap-4 mt-6 md:grid-cols-2",
                                    children: [
                                        [
                                            'businessName',
                                            'email',
                                            'phoneNumber',
                                            'address',
                                            'city',
                                            'state',
                                            'country'
                                        ].map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: field,
                                                        className: "text-sm font-medium text-gray-700 capitalize",
                                                        children: field.replace(/([A-Z])/g, ' $1')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                        lineNumber: 435,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: field,
                                                        id: field,
                                                        value: formData[field],
                                                        onChange: handleChange,
                                                        className: "w-full px-4 py-2 border rounded"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                        lineNumber: 438,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, field, true, {
                                                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                lineNumber: 434,
                                                columnNumber: 17
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "listingType",
                                                    className: "text-sm font-medium text-gray-700",
                                                    children: "Listing Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "listingType",
                                                    value: formData.listingType,
                                                    onChange: handleListingTypeChange,
                                                    className: "w-full px-4 py-2 border rounded",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 458,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "product",
                                                            children: "Products"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 459,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "service",
                                                            children: "Services"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "food",
                                                            children: "Foods"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 448,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col w-full md:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "description",
                                                    className: "text-sm font-medium text-gray-700",
                                                    children: "Description"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 466,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    name: "description",
                                                    value: formData.description,
                                                    onChange: handleChange,
                                                    className: "w-full px-4 py-2 border rounded",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 469,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 465,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col w-full md:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "categories",
                                                    className: "mb-2 text-sm font-medium text-gray-700",
                                                    children: "Business Categories"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 479,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    id: "selectCategory",
                                                    onChange: handleCategoryChange,
                                                    value: "",
                                                    disabled: selectedCategories.length >= 5 || !formData.listingType || pageLoading,
                                                    className: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            disabled: true,
                                                            children: "Select Category - Subcategory"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 491,
                                                            columnNumber: 19
                                                        }, this),
                                                        getCategoriesForListingType().map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: category._id,
                                                                children: category.name
                                                            }, index, false, {
                                                                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                                lineNumber: 493,
                                                                columnNumber: 21
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-row flex-wrap w-full gap-2 mt-4",
                                                    children: selectedCategories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-full",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: category.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                                    lineNumber: 506,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleRemoveCategory(category),
                                                                    className: "ml-2 text-red-500 hover:text-red-700",
                                                                    children: "×"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                                    lineNumber: 507,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 500,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 478,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 432,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                            lineNumber: 425,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                lineNumber: 409,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-4 mt-5 mb-12 sm:px-6 md:px-10 lg:px-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: `mb-6 font-semibold text-gray-800 uppercase cursor-pointer ${selectedTab === "new" ? "text-blue-600 font-bold text-2xl" : "text-gray-400 text-[10px]"}`,
                                onClick: ()=>setSelectedTab("new"),
                                children: "Choose a Plan"
                            }, void 0, false, {
                                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                lineNumber: 527,
                                columnNumber: 11
                            }, this),
                            userSubscriptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mx-3 text-2xl text-gray-600",
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                        lineNumber: 535,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: `mb-6 font-semibold text-gray-800 uppercase cursor-pointer ${selectedTab === "existing" ? "text-blue-600 font-bold text-2xl" : "text-gray-400 text-[10px]"}`,
                                        onClick: ()=>setSelectedTab("existing"),
                                        children: "Existing Plan"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                        lineNumber: 538,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                        lineNumber: 525,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap justify-center w-full gap-6",
                        children: selectedTab === "existing" ? // Display existing subscriptions
                        userSubscriptions.map((sub)=>{
                            const isSelected = selectedPlanId === sub._id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `cursor-pointer flex flex-col justify-between rounded-lg border shadow-sm transition-all p-10 hover:shadow-md xl:w-[30%] ${isSelected ? "bg-[#333333] text-white border-black" : "bg-white text-gray-800 border-gray-200"}`,
                                onClick: ()=>setSelectedPlanId(sub._id),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `text-2xl font-bold text-center uppercase mb-1 ${isSelected ? "text-orange-400" : "text-gray-800"}`,
                                            children: [
                                                sub.subscriptionPlanId?.name,
                                                " Plan"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 564,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm text-center mb-4 ${isSelected ? "text-gray-300" : "text-gray-600"}`,
                                            children: "Your existing plan"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 567,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-3xl text-center font-extrabold mb-4 ${isSelected ? "text-white" : "text-black"}`,
                                            children: [
                                                "$",
                                                sub.subscriptionPlanId?.price,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base font-medium text-gray-400",
                                                    children: [
                                                        "/ ",
                                                        sub.subscriptionPlanId?.durationInDays,
                                                        " Days"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 570,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mb-4 space-y-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 580,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Products: ",
                                                        sub.subscriptionPlanId?.limits.productListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 584,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Services: ",
                                                        sub.subscriptionPlanId?.limits.serviceListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 588,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Foods: ",
                                                        sub.subscriptionPlanId?.limits.foodListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 587,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 592,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Media Limit: ",
                                                        sub.subscriptionPlanId?.limits.imageLimit,
                                                        " images, ",
                                                        sub.subscriptionPlanId?.limits.videoLimit,
                                                        " videos"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 578,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: `${isSelected ? "text-orange-300" : "text-orange-600"}`,
                                                    children: "Features:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "mt-1 ml-5 space-y-1 list-disc",
                                                    children: Object.entries(sub.subscriptionPlanId?.features || {}).map(([key, val])=>val && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                key.replace(/([A-Z])/g, " $1"),
                                                                " ",
                                                                typeof val === "string" ? `(${val})` : ""
                                                            ]
                                                        }, key, true, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 606,
                                                            columnNumber: 31
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 598,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 563,
                                    columnNumber: 19
                                }, this)
                            }, sub._id, false, {
                                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                lineNumber: 556,
                                columnNumber: 17
                            }, this);
                        }) : // Display new subscription plans
                        plans.map((plan)=>{
                            const isSelected = selectedPlanId === plan._id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `cursor-pointer flex flex-col justify-between rounded-lg border shadow-sm transition-all p-10 hover:shadow-md xl:w-[30%] ${isSelected ? "bg-[#333333] text-white border-black" : "bg-white text-gray-800 border-gray-200"}`,
                                onClick: ()=>setSelectedPlanId(plan._id),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `text-2xl font-bold text-center uppercase mb-1 ${isSelected ? "text-orange-400" : "text-gray-800"}`,
                                            children: [
                                                plan.name,
                                                " Plan"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 631,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm text-center mb-4 ${isSelected ? "text-gray-300" : "text-gray-600"}`,
                                            children: "Access powerful features with this plan."
                                        }, void 0, false, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 634,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-3xl text-center font-extrabold mb-4 ${isSelected ? "text-white" : "text-black"}`,
                                            children: [
                                                "$",
                                                plan.price,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base font-medium text-gray-400",
                                                    children: [
                                                        "/ ",
                                                        plan.durationInDays,
                                                        " Days"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 639,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 637,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mb-4 space-y-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 647,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Products: ",
                                                        plan.limits.productListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 646,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 651,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Services: ",
                                                        plan.limits.serviceListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 650,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Foods: ",
                                                        plan.limits.foodListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 659,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Media Limit: ",
                                                        plan.limits.imageLimit,
                                                        " images, ",
                                                        plan.limits.videoLimit,
                                                        " videos"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 658,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 645,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: `${isSelected ? "text-orange-300" : "text-orange-600"}`,
                                                    children: "Features:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "mt-1 ml-5 space-y-1 list-disc",
                                                    children: Object.entries(plan.features).map(([key, val])=>val && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                key.replace(/([A-Z])/g, " $1"),
                                                                " ",
                                                                typeof val === "string" ? `(${val})` : ""
                                                            ]
                                                        }, key, true, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 673,
                                                            columnNumber: 31
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 669,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 665,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 630,
                                    columnNumber: 19
                                }, this)
                            }, plan._id, false, {
                                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                lineNumber: 623,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                        lineNumber: 549,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mt-10",
                        children: selectedTab === "existing" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleBusinessCreation,
                            disabled: loading,
                            className: "px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700",
                            children: loading ? 'Retrying...' : 'Retry Business Creation'
                        }, void 0, false, {
                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                            lineNumber: 692,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: loading,
                            className: "px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700",
                            children: loading ? 'Submitting...' : 'Submit & Pay'
                        }, void 0, false, {
                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                            lineNumber: 700,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                        lineNumber: 690,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                lineNumber: 524,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}}),

};

//# sourceMappingURL=app_%28home%29_partners_business_new_page_tsx_23d519ce._.js.map