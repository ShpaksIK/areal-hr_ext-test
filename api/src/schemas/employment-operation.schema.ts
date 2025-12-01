import * as Joi from 'joi';

export const createEmploymentOperationSchema = Joi.object({
  employee_id: Joi.number().required().messages({
    'any.required': 'Идентификатор сотрудника является обязательным полем',
  }),
  operation_type: Joi.string().required().messages({
    'any.required': 'Тип кадровой операции является обязательным полем',
  }),
  department_id: Joi.number(),
  position_id: Joi.number(),
  salary: Joi.number().min(0).messages({
    'number.min': 'Зарплата не может быть отрицательной',
  }),
});
