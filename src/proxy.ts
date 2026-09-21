import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

/** First gate for the admin panel. Pages and actions re-check the session themselves. */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const admin = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value).catch(
    () => null,
  );
  if (!admin) return NextResponse.redirect(new URL("/admin/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
