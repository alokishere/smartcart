
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
    const {pathname} = req.nextUrl;
    console.log("pathname",pathname);
    const publicRoutes=["/login","/register","/_next", "/favicon.ico"]
 if(publicRoutes.some(url=>req.nextUrl.pathname.startsWith(url))){
    return NextResponse.next();
 }
 const token = await getToken({req,secret:process.env.AUTH_SECRET})
 
 if(!token){
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl",req.url);
    return NextResponse.redirect(loginUrl);
 }
}