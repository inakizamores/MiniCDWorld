import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example middleware - can be expanded for authentication or other purposes
  return NextResponse.next();
}

export const config = {
  // Protect the upload endpoint in production
  matcher: '/api/upload',
}; 