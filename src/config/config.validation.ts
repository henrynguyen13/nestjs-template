import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // App
  APP_PORT: Joi.number().default(3000),
  APP_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  APP_NAME: Joi.string().default('vesta-backend'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  // Throttle
  THROTTLE_TTL: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(100),
});
