(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/(home)/partners/business/new/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CreateNewBusinessPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialForm);
    const [plans, setPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPlanId, setSelectedPlanId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateNewBusinessPage.useEffect": ()=>{
            const fetchPlans = {
                "CreateNewBusinessPage.useEffect.fetchPlans": async ()=>{
                    try {
                        const res = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3001")}/api/subscription-plans`);
                        const data = await res.json();
                        if (res.ok && Array.isArray(data)) {
                            setPlans(data);
                            setSelectedPlanId(data.sort({
                                "CreateNewBusinessPage.useEffect.fetchPlans": (a, b)=>a.price - b.price
                            }["CreateNewBusinessPage.useEffect.fetchPlans"])[0]._id);
                        } else {
                            throw new Error();
                        }
                    } catch  {
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
                                _id: '685281f61e1de765d6b297c01',
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
                                _id: '685281f61e1de765d6b297c02',
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
                        setPlans(dummy);
                        setSelectedPlanId(dummy[0]._id);
                    }
                }
            }["CreateNewBusinessPage.useEffect.fetchPlans"];
            fetchPlans();
        }
    }["CreateNewBusinessPage.useEffect"], []);
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
        try {
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(draftData.message || 'Draft creation failed');
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(stripeData.message || 'Failed to create payment session');
                setLoading(false);
                return;
            }
            // ➤ 3. Redirect to Stripe
            window.location.href = stripeData.sessionUrl;
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Something went wrong. Please try again.');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen px-4 py-10 bg-white sm:px-6 md:px-10 lg:px-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-10 lg:flex-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex justify-center pt-2 sm:pt-10 lg:w-1/2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-[-20px] left-[-20px] w-[60%] h-[60%] bg-custom-yellow z-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/partners/registration-image.png",
                                    alt: "Business Registration",
                                    width: 500,
                                    height: 480,
                                    className: "relative z-10 object-contain rounded-lg shadow"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full lg:w-1/2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "mb-4 text-2xl font-semibold uppercase sm:text-3xl md:text-4xl heading",
                                    children: "BUSINESS REGISTRATION"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 228,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                    className: "h-[2px] w-[100px] bg-green-900"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                    className: "h-[2px] w-[100px] bg-green-900 mt-[1px]"
                                }, void 0, false, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 232,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        ].map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: field,
                                                        className: "text-sm font-medium text-gray-700 capitalize",
                                                        children: field.replace(/([A-Z])/g, ' $1')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        name: field,
                                                        id: field,
                                                        value: formData[field],
                                                        onChange: handleChange,
                                                        className: "w-full px-4 py-2 border rounded"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, field, true, {
                                                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "listingType",
                                                    className: "text-sm font-medium text-gray-700",
                                                    children: "Listing Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "listingType",
                                                    value: formData.listingType,
                                                    onChange: handleChange,
                                                    className: "w-full px-4 py-2 border rounded",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 260,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "product",
                                                            children: "Products"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "service",
                                                            children: "Services"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 262,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "food",
                                                            children: "Foods"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 263,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col w-full md:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "description",
                                                    className: "text-sm font-medium text-gray-700",
                                                    children: "Description"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    name: "description",
                                                    value: formData.description,
                                                    onChange: handleChange,
                                                    className: "w-full px-4 py-2 border rounded",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 267,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "logo",
                                                    className: "text-sm font-medium text-gray-700",
                                                    children: "Logo"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    name: "logo",
                                                    accept: "image/*",
                                                    onChange: handleFileChange,
                                                    className: "w-full px-4 py-2 border rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 280,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "coverImage",
                                                    className: "text-sm font-medium text-gray-700",
                                                    children: "Cover Image"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "file",
                                                    name: "coverImage",
                                                    accept: "image/*",
                                                    onChange: handleFileChange,
                                                    className: "w-full px-4 py-2 border rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 293,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                            lineNumber: 227,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                    lineNumber: 213,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-4 mt-5 mb-12 sm:px-6 md:px-10 lg:px-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-6 text-2xl font-semibold text-gray-800 uppercase",
                        children: "Choose a Plan"
                    }, void 0, false, {
                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap justify-center w-full gap-6",
                        children: plans.map((plan)=>{
                            const isSelected = selectedPlanId === plan._id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `cursor-pointer flex flex-col justify-between rounded-lg border shadow-sm transition-all p-10 hover:shadow-md xl:w-[30%] ${isSelected ? 'bg-[#333333] text-white border-black' : 'bg-white text-gray-800 border-gray-200'}`,
                                onClick: ()=>setSelectedPlanId(plan._id),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `text-2xl font-bold text-center uppercase mb-1 ${isSelected ? 'text-orange-400' : 'text-gray-800'}`,
                                            children: [
                                                plan.name,
                                                " Plan"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 330,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm text-center mb-4 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`,
                                            children: "Access powerful features with this plan."
                                        }, void 0, false, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 333,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-3xl text-center font-extrabold mb-4 ${isSelected ? 'text-white' : 'text-black'}`,
                                            children: [
                                                "₹",
                                                plan.price,
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base font-medium text-gray-400",
                                                    children: [
                                                        "/ ",
                                                        plan.durationInDays,
                                                        " Days"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 336,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mb-4 space-y-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Products: ",
                                                        plan.limits.productListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 350,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Services: ",
                                                        plan.limits.serviceListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 354,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Foods: ",
                                                        plan.limits.foodListings
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 353,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✔"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 358,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Media Limit: ",
                                                        plan.limits.imageLimit,
                                                        " images, ",
                                                        plan.limits.videoLimit,
                                                        " videos"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 357,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 344,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: `${isSelected ? 'text-orange-300' : 'text-orange-600'}`,
                                                    children: "Features:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "mt-1 ml-5 space-y-1 list-disc",
                                                    children: Object.entries(plan.features).map(([key, val])=>val && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                key.replace(/([A-Z])/g, ' $1'),
                                                                " ",
                                                                typeof val === 'string' ? `(${val})` : ''
                                                            ]
                                                        }, key, true, {
                                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                            lineNumber: 372,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                            lineNumber: 364,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                    lineNumber: 329,
                                    columnNumber: 17
                                }, this)
                            }, plan._id, false, {
                                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mt-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: loading,
                            className: "px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700",
                            children: loading ? 'Submitting...' : 'Submit & Pay'
                        }, void 0, false, {
                            fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                            lineNumber: 387,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(home)/partners/business/new/page.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(CreateNewBusinessPage, "/95OKiH7Z1Jx+MyScavms1bwPkw=");
_c = CreateNewBusinessPage;
var _c;
__turbopack_context__.k.register(_c, "CreateNewBusinessPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_%28home%29_partners_business_new_page_tsx_664266a0._.js.map