import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware( req: NextRequest | any, ev: NextFetchEvent ) {
    if (req.nextUrl.pathname.startsWith('/api/admin/')) {
        const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const validRoles = ['admin'];
    
        
        if ( !session ) {
            const url = req.nextUrl.clone()
            url.pathname = '/auth/login'
            return NextResponse.rewrite(url);
        }
        
        if(!validRoles.includes(session.user.role)){
            const url = req.nextUrl.clone()
            url.pathname = '/auth/login'
            return NextResponse.rewrite(url);
        }
    
        return NextResponse.next();
    }
  }