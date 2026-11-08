import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { Request } from 'express';

const deriveKey = promisify(scrypt);
export interface AdminAuthConfig {
  email: string; passwordHash: string; secret: string; secure: boolean; origins?: string[];
}
export async function hashAdminPassword(password: string) {
  if (password.length < 14) throw new Error('Use an admin password of at least 14 characters.');
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${(await deriveKey(password, salt, 64) as Buffer).toString('hex')}`;
}
export async function verifyAdminPassword(password: string, hash: string) {
  const [, salt, digest] = hash.split(':');
  if (!salt || !/^[a-f0-9]{128}$/.test(digest ?? '') || password.length > 1024) return false;
  const expected = Buffer.from(digest, 'hex');
  return timingSafeEqual(expected, await deriveKey(password, salt, expected.length) as Buffer);
}
export function configuredAdminAuth(): AdminAuthConfig | null {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD_HASH: passwordHash, ADMIN_SESSION_SECRET: secret, ADMIN_URL } = process.env;
  const secure = process.env.NODE_ENV === 'production';
  if (!email || !passwordHash?.startsWith('scrypt:') || !secret || secret.length < 32 || (secure && !ADMIN_URL)) return null;
  return { email, passwordHash, secret, secure, origins: [ADMIN_URL, process.env.APP_URL].filter(Boolean) as string[] };
}
export function sessionHash(token: string, config: AdminAuthConfig) {
  return createHmac('sha256', `${config.secret}:${config.passwordHash}`).update(token).digest('hex');
}
export function sessionToken(req: Request) {
  const cookie = req.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith('lawpex_admin='));
  return cookie?.slice('lawpex_admin='.length) ?? '';
}
export function sessionCookie(token: string, config: AdminAuthConfig, maxAge = 8 * 60 * 60) {
  return `lawpex_admin=${token}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${config.secure ? '; Secure' : ''}`;
}
export function sameOrigin(req: Request, config: AdminAuthConfig) {
  const origin = req.get('origin');
  if (!origin) return false;
  if (config.origins?.includes(origin)) return true;
  return !config.secure && origin === `${req.protocol}://${req.get('host')}`;
}
