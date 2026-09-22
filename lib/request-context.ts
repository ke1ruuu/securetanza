/**
 * Shared helpers for what an audit log write needs to know about the request
 * itself — IP and browser/device. Every write site was previously reading
 * these off the request ad hoc (or not at all), which is how audit logs
 * ended up with account numbers stored in the `session` column and "unknown"
 * IPs almost everywhere. Use these instead of reinventing the extraction.
 */

/** A minimal shape covering both NextRequest and the plain Web Request. */
interface RequestLike {
  headers: Headers;
}

/**
 * The client's IP address, if something in front of the app set it.
 *
 * Next.js's Request object has no access to the raw TCP peer address in the
 * App Router — there is no `request.ip`. This only ever resolves to a real
 * value when a reverse proxy, load balancer, or CDN sits in front of the app
 * and sets X-Forwarded-For / X-Real-IP from its own direct view of the
 * connection. A browser hitting this server directly — e.g. an officer's PC
 * on the LAN talking straight to the Debian VM, with nothing in front —
 * will not have either header set, and this returns null.
 *
 * (If that's the deployment shape, the fix isn't here: it's putting
 * something in front — even a local-only reverse proxy — that can see the
 * real socket and forward it. See deploy/README.md.)
 */
export function getClientIp(request: RequestLike): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Can carry a chain ("client, proxy1, proxy2") — the first entry is the
    // original client the proxy chain saw.
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return null;
}

/** Raw User-Agent string — browser/OS, not a fingerprinting identifier. */
export function getUserAgent(request: RequestLike): string | null {
  return request.headers.get("user-agent");
}
