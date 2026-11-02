import { randomBytes } from 'node:crypto';
import { hashAdminPassword } from '../src/server/adminAuth';

// Generate rather than prompt: passwords never enter shell history or process arguments.
const password = randomBytes(24).toString('base64url');
console.log('Save this generated password in your password manager:');
console.log(password);
console.log('\nServer environment variables (keep private):');
console.log(`ADMIN_PASSWORD_HASH='${await hashAdminPassword(password)}'`);
console.log(`ADMIN_SESSION_SECRET='${randomBytes(48).toString('base64url')}'`);
