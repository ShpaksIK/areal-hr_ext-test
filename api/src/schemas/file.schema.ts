import * as Joi from 'joi';

export const createFileSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 50 символов',
    'any.required': 'Название является обязательным полем',
  }),
  employee_id: Joi.number().required().messages({
    'any.required': 'Идентификатор сотрудника является обязательным полем',
  }),
});

export const updateFileSchema = Joi.object({
  user_id: Joi.number().required().messages({
    'any.required': 'Идентификатор пользователя является обязательным полем',
  }),
  id: Joi.number().required().messages({
    'any.required': 'Идентификатор файла является обязательным полем',
  }),
  name: Joi.string().min(1).max(50).messages({
    'string.min': 'Название должно содержать минимум 1 символ',
    'string.max': 'Название должно содержать максимум 50 символов',
    'any.required': 'Название является обязательным полем',
  }),
  employee_id: Joi.number(),
});
