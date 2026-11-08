export const adminSiteUrl = () => import.meta.env.VITE_ADMIN_SITE_URL || (import.meta.env.DEV ? 'http://localhost:3001' : 'https://admin.lawpex.com');
