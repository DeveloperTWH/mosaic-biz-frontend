import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/signin'];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);


type JWTPayload = {
    role: string;
};

function clearClientSessionCookies(res: NextResponse) {
    res.cookies.set('auth_token', '', { maxAge: 0 });
    res.cookies.set('token', '', { maxAge: 0 });
    res.cookies.set('user_gender', '', { maxAge: 0 });
    res.cookies.set('user_session', '', { maxAge: 0 });
    return res;
}

function getAuthToken(req: NextRequest) {
    return req.cookies.get('token')?.value || req.cookies.get('auth_token')?.value;
}

function redirectUnauthorized(req: NextRequest, path: string) {
    const redirectPath = path.startsWith('/admin') ? '/signin' : '/';
    return clearClientSessionCookies(
        NextResponse.redirect(new URL(redirectPath, req.url))
    );
}



export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if (path === "/monitoring") {
        return NextResponse.next();
    }

    if (path.startsWith('/verify-otp')) {
        const otpFlag = req.cookies.get('otpPending')?.value;
        const email = req.nextUrl.searchParams.get('email')?.trim();

        // API auth cookies (including otpPending) are set on the API host when
        // NEXT_PUBLIC_API_BASE_URL is cross-origin, so they are not readable here.
        // Allow OTP entry when the backend set otpPending on this origin, or when
        // login/register supplied a target email query param. OTP is still validated
        // server-side on POST /api/users/verify-otp.
        if (otpFlag === 'true' || email) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL('/', req.url));
    }

    const token = getAuthToken(req);

    // if (token && (path === '/login' || path === '/signup' || path === '/signin')) {
    //     try {
    //         const { payload } = (await jwtVerify(token, JWT_SECRET)) as {
    //             payload: { role: string };
    //         };

    //         if (path === '/signin') {
    //             if (payload.role === 'admin') {
    //                 return NextResponse.redirect(new URL('/admin', req.url));
    //             }

    //             return NextResponse.next();
    //         }

    //         return NextResponse.redirect(new URL(getRedirectPathByRole(payload.role), req.url));
    //     } catch {
    //         return NextResponse.next();
    //     }
    // }


    if (token && (path === '/login' || path === '/signup' || path === '/signin')) {
    try {
        // const { payload } = await jwtVerify(token, JWT_SECRET);
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const { role } = payload as JWTPayload;


        const type = req.nextUrl.searchParams.get('type');


        if (path === '/signup' && type === 'vendor') {
            return NextResponse.next();
        }

        if (path === '/signin') {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            return NextResponse.next();
        }

        // 🚫 Only redirect if NOT vendor signup
        return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
    } catch {
        return NextResponse.next();
    }
}

    if (PUBLIC_PATHS.includes(path)) {
        return NextResponse.next();
    }

    // Partner/customer auth is validated against the API using credentialed requests.
    // When the API lives on a different origin, its auth cookie may not be readable
    // from Next middleware, so we avoid blocking these routes here.
    if (
        path.startsWith('/admin') ||
        path.startsWith('/partners') ||
        path.startsWith('/customer') ||
        path === '/dashboard'
    ) {
        return NextResponse.next();
    }

    if (!token) {
        return redirectUnauthorized(req, path);
    }

    try {
        const { payload } = (await jwtVerify(token, JWT_SECRET)) as {
            payload: { role: string };
        };
        const role = payload.role;

        return NextResponse.next();
    } catch {
        return redirectUnauthorized(req, path);
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
        '/signin',
        '/verify-otp',
        '/dashboard',
    ],
};
