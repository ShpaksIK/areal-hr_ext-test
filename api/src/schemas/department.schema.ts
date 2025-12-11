import * as Joi from 'joi';

export const createDepartmentSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 255 символов',
    'any.required': 'Название является обязательным полем',
  }),
  comment: Joi.string().max(255).messages({
    'string.max': 'Комментарий должен содержать максимум 255 символов',
  }),
  organization_id: Joi.number().required().messages({
    'any.required': 'Идентификатор организации является обязательным полем',
  }),
  parent_id: Joi.number(),
});

export const updateDepartmentSchema = Joi.object({
  user_id: Joi.number().required().messages({
    'any.required': 'Идентификатор пользователя является обязательным полем',
  }),
  id: Joi.number().required().messages({
    'any.required': 'Идентификатор отдела является обязательным полем',
  }),
  name: Joi.string().min(1).max(255).messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 255 символов',
  }),
  comment: Joi.string().allow(null).max(255).messages({
    'string.max': 'Комментарий должен содержать максимум 255 символов',
  }),
  organization_id: Joi.number(),
  parent_id: Joi.number().allow(null),
});
