import * as Joi from 'joi';

export const createEmploymentOperationSchema = Joi.object({
  employee_id: Joi.number().required().messages({
    'any.required':
      'Идентификатор кадровой операции является обязательным полем',
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
  department_id: Joi.number(),
  position_id: Joi.number(),
  salary: Joi.number().min(0).messages({
    'number.min': 'Зарплата не может быть отрицательной',
  }),
});
