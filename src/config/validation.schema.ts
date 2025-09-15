import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Server
  PORT: Joi.number().default(3000),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().default('1h'),
  
  // Database
  DATABASE_URL: Joi.string().required(),
  DATABASE_URL_REPLICA: Joi.string().required(),
  
  // Redis
  REDIS_URL: Joi.string().required(),
  
  // Mail
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().default(465),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
  
  // File Upload
  FILE_UPLOAD_PROVIDER: Joi.string().default(''),
});
