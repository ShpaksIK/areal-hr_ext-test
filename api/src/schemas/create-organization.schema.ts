import * as Joi from 'joi';

export const createOrganizationSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 255 символов',
    'string.required': 'Название является обязательным полем',
  }),
  comment: Joi.string().max(255).messages({
    'string.max': 'Комментарий должен содержать максимум 255 символов',
  }),
});

export const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(1).max(255).messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 255 символов',
  }),
  comment: Joi.string().max(255).messages({
    'string.max': 'Комментарий должен содержать максимум 255 символов',
  }),
});
