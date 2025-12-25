import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('production'),
  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // Aceita os dois (pra compatibilidade), mas exige pelo menos um
  DB_PASS: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),

  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  APP_URL: Joi.string().uri().optional(),
}).custom((value, helpers) => {
  if (!value.DB_PASS && !value.DB_PASSWORD) {
    return helpers.error('any.custom', { message: 'DB_PASS ou DB_PASSWORD é obrigatório' });
  }
  return value;
}, 'DB password validation');
