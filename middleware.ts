import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/signin'];
const JWT_SECRET = new TextEncoder().encode('your_secret_key');

type JWTPayload = {
    role: string;
};

function clearClientSessionCookies(res: NextResponse) {
    res.cookies.set('user_gender', '', { maxAge: 0 });
    res.cookies.set('user_session', '', { maxAge: 0 });
    return res;
}

function redirectUnauthorized(req: NextRequest, path: string) {
    const redirectPath = path.startsWith('/admin') ? '/signin' : '/';
    return clearClientSessionCookies(
        NextResponse.redirect(new URL(redirectPath, req.url))
    );
}



export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if (path.startsWith('/verify-otp')) {
        const otpFlag = req.cookies.get('otpPending')?.value;

        if (otpFlag !== 'true') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;

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

    if (!token) {
        return redirectUnauthorized(req, path);
    }

    try {
        const { payload } = (await jwtVerify(token, JWT_SECRET)) as {
            payload: { role: string };
        };
        const role = payload.role;

        if (path === '/dashboard') {
            return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
        }

        if (path.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/signin', req.url));
        }

        if (path.startsWith('/partners') && role !== 'business_owner') {
            return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
        }

        if (path.startsWith('/customer') && role !== 'customer') {
            return NextResponse.redirect(new URL(getRedirectPathByRole(role), req.url));
        }

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
