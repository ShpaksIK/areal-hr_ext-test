import * as Joi from 'joi';

export const createEmploymentOperationSchema = Joi.object({
  employee_id: Joi.number().required().messages({
    'any.required': 'Идентификатор сотрудника является обязательным полем',
  }),
  operation_type: Joi.valid(
    'create',
    'salaryChanges',
    'departmentChanges',
    'dismissal',
  )
    .required()
    .messages({
      'any.required':
        'Тип кадровой операции является обязательным полем (create, salaryChanges, departmentChanges, dismissal)',
      'any.only':
        'Тип кадровой операции должен быть одним из: create, salaryChanges, departmentChanges, dismissal',
    }),
  department_id: Joi.number().allow(null),
  position_id: Joi.number().allow(null),
  salary: Joi.number().allow(null).min(0).messages({
    'number.min': 'Зарплата не может быть отрицательной',
  }),
});
