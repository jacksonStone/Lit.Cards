const envs = process.env;
const listOfNeededEnvs = [
  'ENCRYPTION_KEY',
  'HMAC_KEY',
  'CARDS_EMAIL_ADDRESS',
  'CARDS_SENDGRID_API_KEY',
  'CARDS_STRIPE_PUBLIC_KEY',
  'CARDS_STRIPE_PRIVATE_KEY',
  'CARDS_STRIPE_WEBHOOK_SECRET',
  'CARDS_SITE_DOMAIN_ROOT',
  'NODE_ENV',
  'MONGODB_URI',
  'CARDS_MONGO_DATABASE_NAME'
];
for(let i of listOfNeededEnvs) {
  if(!envs[i]) throw new Error("Missing environment variable: " + i);
}
