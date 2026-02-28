import Joi from 'joi';

export const createCollectionSchema = Joi.object({
  title: Joi.string().required().min(2).max(200),
  description: Joi.string().optional().max(500),
  isPublic: Joi.boolean().default(false),
});

export const updateCollectionSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(500).optional(),
  isPublic: Joi.boolean().optional(),
});

export const addResourceToCollectionSchema = Joi.object({
  resourceId: Joi.string().required(),
});

export const removeResourceFromCollectionSchema = Joi.object({
  resourceId: Joi.string().required(),
});