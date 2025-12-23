import * as Joi from 'joi';

export const createPositionSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 255 символов',
    'any.required': 'Название является обязательным полем',
  }),
});

export const updatePositionSchema = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'Идентификатор должности является обязательным полем',
  }),
  name: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 255 символов',
    'any.required': 'Название является обязательным полем',
  }),
});
