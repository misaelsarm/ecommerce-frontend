import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function Middleware(req: NextRequest) {

    // Define the path to exclude
    const excludedPath = '/admin/login';

    // Get the request path
    const path = req.nextUrl.pathname;

    // Skip middleware logic if the path is the excluded path
    if (path === excludedPath) {
        console.log('avance por ser login')
        return NextResponse.next();
    }

    // Check for the token in cookies
    const token = req.cookies.get('token');

    // Redirect to login if no token is found
    if (!token) {
        const url = req.nextUrl.clone();
        const returnUrl = encodeURIComponent(url.pathname); // Get the current path

        // Construct an absolute URL for the redirect
        url.pathname = excludedPath;
        url.search = `?returnUrl=${returnUrl}`;

        console.log('redirigí sin token')
        return NextResponse.redirect(url); // Redirect to login with returnUrl
    }

    console.log('avance con token')
    return NextResponse.next(); // Allow the request to proceed

}


export const config = {
    matcher: ['/admin/:path*'], // Add /account to the matcher
};