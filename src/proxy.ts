export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/auth|api/cron|login|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icon-192.png|icon-512.png).*)",
  ],
};
