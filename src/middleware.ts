import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware function to add security headers in production
 */
export function middleware(request: NextRequest) {
  // Get response
  const response = NextResponse.next();
  
  // Add security headers for production
  // Using string literal to avoid process.env type issues
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    // Security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    
    // Add CSP for additional security if needed
    // response.headers.set('Content-Security-Policy', "default-src 'self'");
  }
  
  return response;
}

export const config = {
  // Apply middleware to all routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 