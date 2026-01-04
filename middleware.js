import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Define protected routes
    const isProtectedRoute = pathname === '/' ||
        pathname.startsWith('/products') ||
        pathname.startsWith('/orders') ||
        pathname.startsWith('/inventory') ||
        pathname.startsWith('/customers') ||
        pathname.startsWith('/reviews') ||
        pathname.startsWith('/discounts') ||
        pathname.startsWith('/support') ||
        pathname.startsWith('/cms') ||
        pathname.startsWith('/audit');

    // Check for the auth cookie/storage (conceptual for middleware)
    // Since we use localStorage in the client, middleware can't see it directly.
    // However, we can check for a cookie if you decide to use one.
    // For now, we rely on the client-side ProtectedRoute we just updated
    // which is better for "flicker-free" behavior with localStorage.

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login page)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
    ],
};
