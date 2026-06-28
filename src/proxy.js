import { NextResponse } from 'next/server';

// Dashboard auth guard is handled client-side in dashboard/layout.js
// via AuthContext (Bearer token in localStorage).
// Server-side middleware cannot access localStorage, so we pass through.
export function proxy(request) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
