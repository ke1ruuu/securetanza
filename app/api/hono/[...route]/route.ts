import { honoApp } from '@/backend/hono/app';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

function handleRequest(req: NextRequest) {
  // Strip /api/hono prefix so Hono routes match correctly
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/hono/, '') || '/';
  const newUrl = new URL(`${url.origin}${path}${url.search}`);

  const modifiedReq = new Request(newUrl.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
    // @ts-ignore
    duplex: 'half',
  });

  return honoApp.fetch(modifiedReq);
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
