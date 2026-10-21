import dotenv from 'dotenv';

// Load environment variables overriding any pre-existing shell exports
dotenv.config({ override: true });

const requiredEnv = [
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'AI_SERVICE_URL',
  'CLIENT_URL'
];

const missingEnv = [];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    missingEnv.push(key);
  }
});

if (missingEnv.length > 0) {
  console.error(`[FATAL] Missing required environment variable(s): ${missingEnv.join(', ')}`);
  throw new Error(`Startup failed due to missing environment variables: ${missingEnv.join(', ')}`);
}

export const config = {
  port: parseInt(process.env.PORT, 10),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  aiServiceUrl: process.env.AI_SERVICE_URL,
  clientUrl: process.env.CLIENT_URL
};
