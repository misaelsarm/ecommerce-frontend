import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function Middleware(req: NextRequest) {
    const excludedPath = '/admin/login';
    const path = req.nextUrl.pathname;

    if (path === excludedPath) {
        console.log('avance por ser login');
        return NextResponse.next();
    }

    const token = req.cookies.get('token');

    if (!token) {
        const url = req.nextUrl.clone();
        const returnUrl = encodeURIComponent(url.pathname);
        url.pathname = excludedPath;
        url.search = `?returnUrl=${returnUrl}`;
        console.log('redirigí sin token');
        return NextResponse.redirect(url);
    }

    try {
        // Decode and verify the JWT token using Web Crypto API
        const decodedToken = await verifyJwt(token.value, process.env.JWT_SECRET as string);

        const userRole = decodedToken.role?.value;

        const validUser = decodedToken.active && decodedToken.verified

        if (!validUser) {
            console.log('Usuario no valido');
            // const url = req.nextUrl.clone();
            // url.pathname = '/admin/403';
            // return NextResponse.redirect(url);
        }

        const userPermissions: {
            "page": string,
            "permissions": string[]
        }[] = decodedToken.permissions || [];

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

        console.log({ requiredPermissions, path })

        if (requiredPermissions) {
            const hasPermission = requiredPermissions.every((perm) => {
                console.log({ perm })
                return userPermissions.some((p) => {
                    console.log({ p })
                    return p.page === path && p.permissions.includes(perm)
                })
            }
            );

            console.log({ hasPermission })

            if (!hasPermission) {
                console.log('No tienes permiso para esta vista');
                const url = req.nextUrl.clone();
                url.pathname = '/admin/403';
                return NextResponse.redirect(url);
            }
        } else {
            console.log('avance con token y permisos válidos');
            return NextResponse.next();
        }

    } catch (error) {
        console.log('Error en la verificación del token:', error);
        const url = req.nextUrl.clone();
        url.pathname = excludedPath;
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};

// Helper function to verify JWT using Web Crypto API
async function verifyJwt(token: string, secret: string) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    const [header, payload, signature] = token.split('.');

    const data = `${header}.${payload}`;
    const signatureBuffer = new Uint8Array(
        atob(signature.replace(/_/g, '/').replace(/-/g, '+')).split('').map((c) => c.charCodeAt(0))
    );

    const isValid = await crypto.subtle.verify(
        'HMAC',
        cryptoKey,
        signatureBuffer,
        new TextEncoder().encode(data)
    );

    if (!isValid) {
        throw new Error('Invalid token');
    }

    return JSON.parse(atob(payload));
}
