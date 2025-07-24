import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = createRouteMatcher(["/", "/sign-in", "/sign-up"]);
const ignoredRoutes = createRouteMatcher(["/api/health"]);

export default clerkMiddleware((auth: any, req: NextRequest) => {
  // Handle language detection from cookies or headers
  const language = req.cookies.get('i18nextLng')?.value || 
                  req.headers.get('accept-language')?.split(',')[0].split('-')[0] || 
                  'en';
  
  if (ignoredRoutes(req)) return;
  
  // For public routes, we still want to handle language
  if (publicRoutes(req)) {
    const response = NextResponse.next();
    // Set language cookie if not already set
    if (!req.cookies.has('i18nextLng')) {
      response.cookies.set('i18nextLng', language);
    }
    return response;
  }

  if (!auth.userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    const response = NextResponse.redirect(signInUrl);
    
    // Set language cookie if not already set
    if (!req.cookies.has('i18nextLng')) {
      response.cookies.set('i18nextLng', language);
    }
    
    return response;
  }
  
  // For authenticated routes
  const response = NextResponse.next();
  // Set language cookie if not already set
  if (!req.cookies.has('i18nextLng')) {
    response.cookies.set('i18nextLng', language);
  }
  return response;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
