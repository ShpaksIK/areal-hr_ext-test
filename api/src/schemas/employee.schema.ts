import * as Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  first_name: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Имя должно содержать минимум 1 символ',
    'string.max': 'Имя должно содержать максимум 50 символов',
    'any.required': 'Имя является обязательным полем',
  }),
  last_name: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Фамилия должна содержать минимум 1 символ',
    'string.max': 'Фамилия должна содержать максимум 50 символов',
    'any.required': 'Фамилия является обязательным полем',
  }),
  patronymic: Joi.string().allow(null).max(50).messages({
    'string.max': 'Отчество должно содержать максимум 50 символов',
  }),
  birth_date: Joi.date().iso().max('now').required().messages({
    'date.format': 'Дата рождения должна быть в формате ГГГГ-ММ-ДД',
    'date.base': 'Дата рождения должна быть корректной датой',
    'date.max': 'Дата рождения не может быть в будущем',
    'any.required': 'Дата рождения является обязательным полем',
  }),
  passport_series: Joi.string().length(4).required().messages({
    'string.length': 'Серия паспорта должна содержать ровно 4 символа',
    'any.required': 'Серия паспорта является обязательным полем',
  }),
  passport_number: Joi.string().length(6).required().messages({
    'string.length': 'Номер паспорта должна содержать ровно 6 символов',
    'any.required': 'Номер паспорта является обязательным полем',
  }),
  passport_issue_date: Joi.date().iso().max('now').required().messages({
    'date.format': 'Дата выдачи должна быть в формате ГГГГ-ММ-ДД',
    'date.base': 'Дата выдачи должна быть корректной датой',
    'date.max': 'Дата выдачи не может быть в будущем',
    'any.required': 'Дата выдачи является обязательным полем',
  }),
  passport_division_code: Joi.string()
    .pattern(/^\d{3}-\d{3}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Код подразделения должен быть в формате XXX-XXX (3 цифры, дефис, 3 цифры)',
      'any.required': 'Код подразделения является обязательным полем',
    }),
  passport_issued_by: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Поле "Кем выдан" должно содержать минимум 1 символ',
    'string.max': 'Поле "Кем выдан" должно содержать максимум 255 символов',
    'any.required': 'Поле "Кем выдан" является обязательным',
  }),
  address_region: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Регион должен содержать минимум 1 символов',
    'string.max': 'Регион должен содержать максимум 50 символов',
    'any.required': 'Регион является обязательным полем',
  }),
  address_city: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Город должен содержать минимум 1 символов',
    'string.max': 'Город должен содержать максимум 50 символов',
    'any.required': 'Город является обязательным полем',
  }),
  address_street: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Улица должна содержать минимум 1 символов',
    'string.max': 'Улица должна содержать максимум 50 символов',
    'any.required': 'Улица является обязательным полем',
  }),
  address_house: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Регион должен содержать минимум 1 символов',
    'string.max': 'Регион должен содержать максимум 50 символов',
    'any.required': 'Регион является обязательным полем',
  }),
  address_building: Joi.string().allow(null).max(50).messages({
    'string.max': 'Корпус должен содержать максимум 50 символов',
  }),
  address_apartment: Joi.string().allow(null).max(50).messages({
    'string.max': 'Квартира должна содержать максимум 50 символов',
  }),
});

export const updateEmployeeSchema = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'Идентификатор сотрудника является обязательным полем',
  }),
  first_name: Joi.string().min(1).max(50).messages({
    'string.min': 'Имя должно содержать минимум 1 символ',
    'string.max': 'Имя должно содержать максимум 50 символов',
  }),
  last_name: Joi.string().min(1).max(50).messages({
    'string.min': 'Фамилия должна содержать минимум 1 символ',
    'string.max': 'Фамилия должна содержать максимум 50 символов',
  }),
  patronymic: Joi.string().allow(null).max(50).messages({
    'string.max': 'Отчество должно содержать максимум 50 символов',
  }),
  birth_date: Joi.date().iso().max('now').messages({
    'date.format': 'Дата рождения должна быть в формате ГГГГ-ММ-ДД',
    'date.base': 'Дата рождения должна быть корректной датой',
    'date.max': 'Дата рождения не может быть в будущем',
  }),
  passport_series: Joi.string().length(4).messages({
    'string.length': 'Серия паспорта должна содержать ровно 4 символа',
  }),
  passport_number: Joi.string().length(6).messages({
    'string.length': 'Номер паспорта должна содержать ровно 6 символов',
  }),
  passport_issue_date: Joi.date().iso().max('now').messages({
    'date.format': 'Дата выдачи должна быть в формате ГГГГ-ММ-ДД',
    'date.base': 'Дата выдачи должна быть корректной датой',
    'date.max': 'Дата выдачи не может быть в будущем',
  }),
  passport_division_code: Joi.string()
    .pattern(/^\d{3}-\d{3}$/)
    .messages({
      'string.pattern.base':
        'Код подразделения должен быть в формате XXX-XXX (3 цифры, дефис, 3 цифры)',
    }),
  passport_issued_by: Joi.string().min(1).max(255).messages({
    'string.min': 'Поле "Кем выдан" должно содержать минимум 1 символ',
    'string.max': 'Поле "Кем выдан" должно содержать максимум 255 символов',
  }),
  address_region: Joi.string().min(1).max(50).messages({
    'string.min': 'Регион должен содержать минимум 1 символов',
    'string.max': 'Регион должен содержать максимум 50 символов',
  }),
  address_city: Joi.string().min(1).max(50).messages({
    'string.min': 'Город должен содержать минимум 1 символов',
    'string.max': 'Город должен содержать максимум 50 символов',
  }),
  address_street: Joi.string().min(1).max(50).messages({
    'string.min': 'Улица должна содержать минимум 1 символов',
    'string.max': 'Улица должна содержать максимум 50 символов',
  }),
  address_house: Joi.string().min(1).max(50).messages({
    'string.min': 'Регион должен содержать минимум 1 символов',
    'string.max': 'Регион должен содержать максимум 50 символов',
  }),
  address_building: Joi.string().allow(null).max(50).messages({
    'string.max': 'Корпус должен содержать максимум 50 символов',
  }),
  address_apartment: Joi.string().allow(null).max(50).messages({
    'string.max': 'Квартира должна содержать максимум 50 символов',
  }),
});
