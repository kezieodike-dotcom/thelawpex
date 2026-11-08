export class AdminApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin${path}`, { ...init, credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new AdminApiError(response.status, body.error || `The admin service returned ${response.status}.`);
  }
  return response.json();
}
export const jsonBody = (value: unknown): RequestInit => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
export const publicSiteUrl = (path = '/') => new URL(path, import.meta.env.VITE_PUBLIC_SITE_URL || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://lawpex.com')).toString();
