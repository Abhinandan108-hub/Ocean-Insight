import Joi from 'joi';

export const createEventSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required().min(10).max(2000),
  startDate: Joi.date().required().iso(),
  endDate: Joi.date().iso().optional(),
  location: Joi.string().required().min(2).max(200),
  externalLink: Joi.string().uri().optional(),
  liveStreamLink: Joi.string().uri().optional(),
  eventImage: Joi.string().uri().optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  location: Joi.string().min(2).max(200).optional(),
  externalLink: Joi.string().uri().optional(),
  liveStreamLink: Joi.string().uri().optional(),
  eventImage: Joi.string().uri().optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
});

export const registerForEventSchema = Joi.object({
  userId: Joi.string().required(),
});