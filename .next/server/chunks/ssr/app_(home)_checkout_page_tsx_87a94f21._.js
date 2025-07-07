module.exports = {

"[project]/app/(home)/checkout/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SubscriptionCheckoutButton)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function SubscriptionCheckoutButton() {
    const handleSubscribe = async ()=>{
        const res = await fetch('https://your-backend.com/api/payments/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'user@example.com',
                planId: 'basic_plan_id'
            })
        });
        const { sessionUrl } = await res.json();
        // Redirect user to Stripe Checkout
        window.location.href = sessionUrl;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleSubscribe,
        className: "px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700",
        children: "Subscribe Now"
    }, void 0, false, {
        fileName: "[project]/app/(home)/checkout/page.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=app_%28home%29_checkout_page_tsx_87a94f21._.js.map