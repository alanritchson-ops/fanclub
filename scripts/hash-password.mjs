import { randomBytes, scrypt } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Usage: npm run admin:hash -- "a password of 12+ characters"');
  process.exit(1);
}
const salt = randomBytes(16);
scrypt(password, salt, 64, (err, key) => {
  if (err) throw err;
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`);
});
