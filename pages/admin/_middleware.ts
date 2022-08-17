import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware( req: NextRequest | any, ev: NextFetchEvent ) {
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ( !session ) {
        const requestedPage = req.page.name;
        return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);
    }

    // console.log("ROLE: "+session);
    const validRoles = ['admin', 'super-user', 'SEO'];
    console.log(validRoles)
    if(!validRoles.includes(session.user.role)){
        return NextResponse.redirect(`/`);
    }

    return NextResponse.next();
}