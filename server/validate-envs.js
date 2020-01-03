const envs = process.env;
const listOfNeededEnvs = [
  'SIMPLE_NOTE_ENCRYPTION',
  'SIMPLE_NOTE_HMAC_KEY',
  'EMAIL_ADDRESS',
  'EMAIL_PASSWORD',
  'STRIPE_PUBLIC_KEY',
  'STRIPE_PRIVATE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SITE_DOMAIN_ROOT',
  'NODE_ENV',
];
for(let i of listOfNeededEnvs) {
  if(!envs[i]) throw new Error("Missing environment variable: " + i);
}
