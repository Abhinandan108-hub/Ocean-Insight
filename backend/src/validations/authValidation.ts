import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required().lowercase(),
  // password complexity is enforced here; frontend already ensures match
  password: Joi.string().required().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[!@#$%^&*]/),
  // confirmPassword is optional on the server side, since the client validates it
  confirmPassword: Joi.string().optional().valid(Joi.ref('password')),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).pattern(/[!@#$%^&*]/),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});