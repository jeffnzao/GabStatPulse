import { middleware } from "next-auth/middleware";
import { NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};

export default middleware;
