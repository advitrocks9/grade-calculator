import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const MAX_ENTRIES = 1000;

const requestLog = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);

  if (requestLog.size > MAX_ENTRIES) {
    for (const [key, vals] of requestLog) {
      const filtered = vals.filter((t) => now - t < WINDOW_MS);
      if (filtered.length === 0) {
        requestLog.delete(key);
      } else {
        requestLog.set(key, filtered);
      }
    }
  }

  return recent.length > MAX_REQUESTS;
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isOriginAllowed(request: NextRequest): boolean {
  if (SAFE_METHODS.has(request.method)) return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  const allowed = request.nextUrl.origin;
  return origin === allowed;
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!isOriginAllowed(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const protectedPaths = ["/analytics", "/distributions", "/profile"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );

  if (isProtected) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/?login=true", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
