// src/middleware.ts (또는 프로젝트 루트)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';

  if (maintenanceMode) {
    const isMaintenancePage = request.nextUrl.pathname.startsWith('/maintenance');

    // maintenance가 아닌 다른 URL이면 리디렉트
    if (!isMaintenancePage) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }

  return NextResponse.next();
}

// middleware가 적용될 경로 지정
export const config = {
    matcher: ['/((?!_next|favicon.ico|icons).*)'], // icons 폴더도 예외로 추가
  };
  
