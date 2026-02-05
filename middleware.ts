import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // 🔐 Allow /verify-otp only if otpPending cookie exists
    if (path.startsWith('/verify-otp')) {
        const otpFlag = req.cookies.get('otpPending')?.value;
        console.log(otpFlag);

        if (otpFlag !== 'true') {
            console.log("here");

            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;

    // 🔐 Redirect authenticated users away from login/signup
    if (token && (path === '/login' || path === '/signup')) {
        try {
            const secret = new TextEncoder().encode("your_secret_key");
            const { payload } = await jwtVerify(token, secret) as { payload: { role: string } };

            return NextResponse.redirect(new URL(getRedirectPathByRole(payload.role), req.url));
        } catch {
            return NextResponse.next(); // invalid token → allow to proceed
        }
    }

    // ✅ Allow public pages if no token
    if (PUBLIC_PATHS.includes(path)) {
        return NextResponse.next();
    }

    // 🔐 Block access if not logged in
    if (!token) {
        const res = NextResponse.redirect(new URL('/', req.url));
        res.cookies.set('user_gender', '', { maxAge: 0 });
        res.cookies.set('user_session', '', { maxAge: 0 });
        return res;
    }


    try {
        const secret = new TextEncoder().encode("your_secret_key");
        const { payload } = await jwtVerify(token, secret) as { payload: { role: string } };
        const role = payload.role;

        if (path === '/dashboard') {
            return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
        }

        // 🔐 Role-based route protection
        // if (path.startsWith('/admin') && role !== 'admin') {
        //     return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
        // }
        // if (path.startsWith('/partners') && role !== 'business_owner') {
        //     return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
        // }
        // if (path.startsWith('/customer') && role !== 'customer') {
        //     return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
        // }

        return NextResponse.next(); // ✅ Authorized
    } catch {
        const res = NextResponse.redirect(new URL('/', req.url));
        res.cookies.set('user_gender', '', { maxAge: 0 });
        res.cookies.set('user_session', '', { maxAge: 0 });
        return res;

    }
}

function getRedirectPathByRole(role: string): string {
    switch (role) {
        case 'admin':
            return '/admin';
        case 'business_owner':
            return '/partners';
        case 'customer':
            return '/';
        default:
            return '/';
    }
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/partners/:path*',
        '/customer/:path*',
        '/login',
        '/signup',
        '/verify-otp',
        '/dashboard',
    ],
};
