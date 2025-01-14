import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export default async function middleware(req: NextRequest) {
    // 1. Check if router is protected
    const protectedRoutes = ['/panel'];
    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(currentPath);
    if(isProtectedRoute) {
        // 2. check for valid session
        const cookie = cookies().get('session')?.value || '';
        const session = await decrypt(cookie);

        // 3. redirect unauthorized users
        if (!session?.userId) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
    }
    if(currentPath === '/login') {
        // 2. check for valid session
        const cookie = cookies().get('session')?.value || '';
        const session = await decrypt(cookie);

        // 3. redirect unauthorized users
        if (session?.userId) {
            return NextResponse.redirect(new URL('/panel', req.nextUrl));
        }
    }

    // 4. render route
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}