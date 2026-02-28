import Joi from 'joi';

export const createResourceSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required().min(10).max(1000),
  content: Joi.string().required().min(10),
  type: Joi.string().valid('Video', 'Image', 'Lesson', 'Link', 'PDF').required(),
  gradeLevel: Joi.string().valid('K-2', '3-5', '6-8', '9-12', 'Higher Ed', 'General').required(),
  subject: Joi.string().required().min(2).max(100),
  tags: Joi.array().items(Joi.string().min(2).max(50)).default([]),
  mediaUrl: Joi.string().uri().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
});

export const updateResourceSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  content: Joi.string().min(10).optional(),
  type: Joi.string().valid('Video', 'Image', 'Lesson', 'Link', 'PDF').optional(),
  gradeLevel: Joi.string().valid('K-2', '3-5', '6-8', '9-12', 'Higher Ed', 'General').optional(),
  subject: Joi.string().min(2).max(100).optional(),
  tags: Joi.array().items(Joi.string().min(2).max(50)).optional(),
  mediaUrl: Joi.string().uri().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  isPublished: Joi.boolean().optional(),
});

export const searchResourceSchema = Joi.object({
  query: Joi.string().optional(),
  grade: Joi.string().optional(),
  type: Joi.string().optional(),
  subject: Joi.string().optional(),
  tag: Joi.string().optional(),
  sort: Joi.string().valid('newest', 'oldest', 'popular', 'views').default('newest'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});