import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Auth is handled client-side in AppLayout. Proxy only rewrites API paths if needed.
export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
