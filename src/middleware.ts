import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { makeRequest } from './utils/makeRequest';
import { UserInterface } from './interfaces';

export default async function Middleware(req: NextRequest) {

    const path = req.nextUrl.pathname;

    const token = req.cookies.get('token')?.value;

    let user: UserInterface;

    if (path === '/admin/login') {
        // Allow access to the login page
        return NextResponse.next();
    }

    // Case 1: User does not have a token (not logged in)
    if (!token) {

        if (path.startsWith('/admin')) {
            // If accessing /admin/*, redirect to login with a returnUrl parameter
            const loginUrl = req.nextUrl.clone();
            const returnUrl = encodeURIComponent(path + req.nextUrl.search); // Encode full path and query string
            loginUrl.pathname = '/admin/login';
            loginUrl.search = `?returnUrl=${returnUrl}`;
            console.log('Redirecting to login with returnUrl:', returnUrl);
            return NextResponse.redirect(loginUrl);
        }

        if (path === '/account') {
            // Redirect to home page when accessing /account without a token
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // Case 1: User has a token (already logged in)
    if (token) {
        try {

            const data = await makeRequest('get', '/api/auth/renew', {}, {
                headers: {
                    "x-access-token": token,
                }
            })

            user = data

            const userRole = user.role;

            const validUser = user.active && user.verified

            if (!validUser) {
                // If accessing /admin/*, redirect to login with a returnUrl parameter
                const loginUrl = req.nextUrl.clone();
                //const returnUrl = encodeURIComponent(path + req.nextUrl.search); // Encode full path and query string
                loginUrl.pathname = '/admin/login';

                return NextResponse.redirect(loginUrl);
            }

            if (path === '/admin/login') {
                // User is logged in but trying to access the login page, redirect them to the admin page
                return NextResponse.redirect(
                    new URL('/admin/orders?page=1&limit=20', req.url)
                );
            }

            // If the path starts with /admin, allow access to all /admin/* pages
            if (path.startsWith('/admin')) {

                try {

                    const userPermissions: {
                        "page": string,
                        "permissions": string[]
                    }[] = user.permissions || [];

                    // If the user has an 'admin' role, skip the permission checks
                    if (userRole === 'admin') {
                        console.log({ userRole })
                        return NextResponse.next();
                    }

                    const permissionsMap: Record<string, string[]> = {
                        '/admin/orders': ['view'],
                        '/admin/products': ['view'],
                        '/admin/attributes': ['view'],
                        '/admin/values': ['view'],
                        '/admin/collections': ['view'],
                        '/admin/customers': ['view'],
                        '/admin/users': ['view'],
                        '/admin/discounts': ['view'],
                    };

                    const requiredPermissions = permissionsMap[path];

                    if (requiredPermissions) {
                        const hasPermission = requiredPermissions.every((perm) => {
                            console.log({ perm })
                            return userPermissions.some((p) => {
                                console.log({ p })
                                return p.page === path && p.permissions.includes(perm)
                            })
                        }
                        );

                        if (!hasPermission) {
                            console.log('No tienes permiso para esta vista');
                            const url = req.nextUrl.clone();
                            url.pathname = '/404';
                            url.search = ``;
                            return NextResponse.redirect(url);
                        }
                    } else {
                        console.log('avance con token y permisos válidos');
                        return NextResponse.next();
                    }

                } catch (error) {
                    console.log('Error en la verificación del token:', error);
                    // If accessing /admin/*, redirect to login with a returnUrl parameter
                    const loginUrl = req.nextUrl.clone();
                    const returnUrl = encodeURIComponent(path + req.nextUrl.search); // Encode full path and query string
                    loginUrl.pathname = '/admin/login';
                    loginUrl.search = `?returnUrl=${returnUrl}`;
                    console.log('Redirecting to login with returnUrl:', returnUrl);
                    return NextResponse.redirect(loginUrl);
                }
            }

            // Allow access to the /account page
            if (path === '/account') {
                return NextResponse.next();
            }
        } catch (error) {
            console.log('error!!!')
            // If accessing /admin/*, redirect to login with a returnUrl parameter
            const loginUrl = req.nextUrl.clone();
            loginUrl.search = '';
            loginUrl.pathname = '/admin/login';
            return NextResponse.redirect(loginUrl);
        }
    }
}

export const config = {
    matcher: ['/admin/:path*', '/account'],
};