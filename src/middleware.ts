import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { makeRequest } from './utils/makeRequest';
import { UserInterface } from './interfaces';
import { pagePermissionsMap } from './utils/mappings';

const getValidBasePath = (pathname: string) => {

    const pathSegments = pathname.split('/').slice(0, 4); // Keep up to 3 levels deep

    const possiblePaths = [];

    // Generate possible paths in descending specificity
    for (let i = pathSegments.length; i > 1; i--) {
        possiblePaths.push(pathSegments.slice(0, i).join('/'));
    }

    // Check each possible path in order of specificity
    return possiblePaths.find(path => pagePermissionsMap[path]) || '/admin';
};

export default async function Middleware(req: NextRequest) {

    const { pathname } = req.nextUrl;

    const token = req.cookies.get('token')?.value;

    let user: UserInterface;

    if (pathname === '/admin/login') {
        // Allow access to the login page
        return NextResponse.next();
    }

    // Case 1: User does not have a token (not logged in)
    if (!token) {

        if (pathname.startsWith('/admin')) {
            // If accessing /admin/*, redirect to login with a returnUrl parameter
            const loginUrl = req.nextUrl.clone();
            const returnUrl = encodeURIComponent(pathname + req.nextUrl.search); // Encode full path and query string
            loginUrl.pathname = '/admin/login';
            loginUrl.search = `?returnUrl=${returnUrl}`;
            return NextResponse.redirect(loginUrl);
        }

        // Check if the path matches `/account` or starts with `/account/orders/`
        if ((pathname.startsWith('/account'))) {
            // Redirect to home page when accessing protected paths without a token
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // Case 1: User has a token (already logged in)
    if (token) {
        //si es un usuario valido
        if (pathname.startsWith('/admin')) {

            try {

                const data = await makeRequest('get', '/api/auth/renew', {}, {
                    headers: {
                        "x-access-token": token,
                    }
                })

                user = data

                const userRole = user.role;

                const validUser = user.active && user.verified

                console.log({ validUser })

                if (!validUser) {
                    // If accessing /admin/*, redirect to login with a returnUrl parameter
                    const loginUrl = req.nextUrl.clone();
                    //const returnUrl = encodeURIComponent(path + req.nextUrl.search); // Encode full path and query string
                    loginUrl.pathname = '/admin/login';

                    return NextResponse.redirect(loginUrl);
                }

                // Get the base path (first two segments like '/admin/orders')
                const basePath = getValidBasePath(pathname);

                // Fallback to '/admin' if the base path doesn't exist
                const requiredPermissions = pagePermissionsMap[basePath];

                console.log({ basePath, requiredPermissions })

                try {
                    const userPermissions: {
                        "page": string,
                        "permissions": string[]
                    }[] = user.permissions || [];

                    // If the user has an 'admin' role, skip the permission checks
                    if (userRole === 'admin') {
                        return NextResponse.next();
                    }

                    if (requiredPermissions) {
                        const hasPermission = requiredPermissions.every((perm) => {
                            return userPermissions.some((p) => {
                                return p.page === basePath && p.permissions.includes(perm);
                            });
                        });

                        if (!hasPermission) {
                            const url = req.nextUrl.clone();
                            url.pathname = '/404';
                            return NextResponse.redirect(url);
                        }
                    }
                } catch (error) {
                    const loginUrl = req.nextUrl.clone();
                    const returnUrl = encodeURIComponent(pathname + req.nextUrl.search);
                    loginUrl.pathname = '/admin/login';
                    loginUrl.search = `?returnUrl=${returnUrl}`;
                    return NextResponse.redirect(loginUrl);
                }

            } catch (error) {
                // If accessing /admin/*, redirect to login with a returnUrl parameter
                const loginUrl = req.nextUrl.clone();
                loginUrl.search = '';
                loginUrl.pathname = '/admin/login';
                return NextResponse.redirect(loginUrl);
            }
        }

        // Allow access to the /account page
        if (pathname.startsWith('/account')) {

            try {
                const data = await makeRequest('get', '/api/auth/renew', {}, {
                    headers: {
                        "x-access-token": token,
                    }
                })

                user = data

                const validUser = user.active && user.verified

                if (!validUser) {
                    // If accessing /admin/*, redirect to login with a returnUrl parameter
                    const loginUrl = req.nextUrl.clone();
                    //const returnUrl = encodeURIComponent(path + req.nextUrl.search); // Encode full path and query string
                    loginUrl.pathname = '/';

                    return NextResponse.redirect(loginUrl);
                }

                return NextResponse.next();
            } catch (error) {
                // If accessing /admin/*, redirect to login with a returnUrl parameter
                const loginUrl = req.nextUrl.clone();
                loginUrl.search = '';
                loginUrl.pathname = '/';
                return NextResponse.redirect(loginUrl);
            }
        }
    }
}

export const config = {
    matcher: ['/:path*'],
};