/**
 * Authentication utilities
 */
import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export interface User {
  id: number;
  accountNumber: string;
  fullName: string;
  permissions: string[];
  mustChangePassword?: boolean;
  defaultLandingPage?: string;
}

export interface SessionPayload {
  sessionId: string;
  userId: number;
  accountNumber: string;
  fullName: string;
  permissions: string[];
  mustChangePassword: boolean;
  defaultLandingPage: string;
  expiresAt: Date;
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Create a JWT token
 */
export async function createToken(payload: Omit<SessionPayload, 'expiresAt'>): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  return new SignJWT({ ...payload, expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Create a session cookie
 */
export async function createSession(user: User): Promise<string> {
  const sessionId = crypto.randomUUID();
  const token = await createToken({
    sessionId,
    userId: user.id,
    accountNumber: user.accountNumber,
    fullName: user.fullName,
    permissions: user.permissions,
    mustChangePassword: user.mustChangePassword ?? false,
    defaultLandingPage: user.defaultLandingPage ?? "dashboard",
  });

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return sessionId;
}

/**
 * Get the current session
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Delete the session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(session: SessionPayload | null, permission: string): boolean {
  if (!session) return false;
  return session.permissions.includes(permission) || session.permissions.includes('admin');
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(session: SessionPayload | null, permissions: string[]): boolean {
  if (!session) return false;
  if (session.permissions.includes('admin')) return true;
  return permissions.some(permission => session.permissions.includes(permission));
}
