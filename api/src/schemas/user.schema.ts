import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  first_name: Joi.string().max(50).required().messages({
    'string.max': 'Имя должно содержать максимум 50 символов',
    'any.required': 'Имя является обязательным полем',
  }),
  last_name: Joi.string().max(50).required().messages({
    'string.max': 'Фамилия должна содержать максимум 50 символов',
    'any.required': 'Фамилия является обязательным полем',
  }),
  patronymic: Joi.string().allow(null).max(50).messages({
    'string.max': 'Отчество должно содержать максимум 50 символов',
  }),
  login: Joi.string().max(255).required().messages({
    'string.max': 'Логин должен содержать максимум 255 символов',
    'any.required': 'Логин является обязательным полем',
  }),
  password: Joi.string().max(255).required().messages({
    'string.max': 'Пароль должен содержать максимум 255 символов',
    'any.required': 'Пароль является обязательным полем',
  }),
  role_id: Joi.number().required().messages({
    'any.required': 'Идентификатор роли является обязательным полем',
  }),
});

export const updateUserSchema = Joi.object({
  user_id: Joi.number().required().messages({
    'any.required': 'Идентификатор пользователя является обязательным полем',
  }),
  id: Joi.number().required().messages({
    'any.required': 'Идентификатор отдела является обязательным полем',
  }),
  first_name: Joi.string().max(50).messages({
    'string.max': 'Имя должно содержать максимум 50 символов',
  }),
  last_name: Joi.string().max(50).messages({
    'string.max': 'Фамилия должна содержать максимум 50 символов',
  }),
  patronymic: Joi.string().allow(null).max(50).messages({
    'string.max': 'Отчество должно содержать максимум 50 символов',
  }),
  login: Joi.string().max(255).messages({
    'string.max': 'Логин должен содержать максимум 255 символов',
  }),
  password: Joi.string().max(255).messages({
    'string.max': 'Пароль должен содержать максимум 255 символов',
  }),
  role_id: Joi.number(),
});
