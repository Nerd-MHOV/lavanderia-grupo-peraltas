import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

const key = new TextEncoder().encode(process.env.JWT_SECRET);

const cookie = {
    name: 'session',
    options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
    },
    duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1day')
    .sign(key)
}

export async function decrypt(session: string) {
    try {
        const { payload } = await jwtVerify(session, key, {algorithms: ['HS256']})
        return payload
    } catch {
        return null
    }
}

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + cookie.duration)
    const session = await encrypt({ userId, expires })

    cookies().set(cookie.name, session, { ...cookie.options, expires})
    redirect('/panel', RedirectType.push)
}

export async function verifySession() {
    const ck = cookies().get(cookie.name)?.value || ''
    const session = await decrypt(ck)
    if( !session?.userId ) {
        redirect('/login')
    }

    return { userId: session.userId as string }
}

export async function deleteSession() {
    cookies().delete(cookie.name)
    redirect('/login')
}