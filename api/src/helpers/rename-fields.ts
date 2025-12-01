const fieldLabels = {
  name: 'Название',
  id: 'Идентификатор',
  employee_id: 'Идентификатор сотрудника',
  comment: 'Комментарий',
  organization_id: 'Идентификатор организации',
  parent_id: 'Идентификатор родительской сущности',
  first_name: 'Имя',
  last_name: 'Фамилия',
  patronymic: 'Отчество',
  login: 'Логин',
  password_hash: 'Пароль',
  role_id: 'Идентификатор роли',
  user_id: 'Идентификатор пользователя',
  entity_type: 'Тип сущности',
  entity_id: 'Идентификатор сущности',
  changed_fields: 'Измененные поля',
  birth_date: 'Дата рождения',
  passport_series: 'Серия паспорта',
  passport_number: 'Номер паспорта',
  passport_issue_date: 'Дата выдачи паспорта',
  passport_division_code: 'Код подразделения',
  passport_issued_by: 'Кем выдан паспорт',
  address_region: 'Область',
  address_city: 'Населенный пункт',
  address_street: 'Улица',
  address_house: 'Дом',
  address_building: 'Корпус',
  address_apartment: 'Квартира',
  operation_type: 'Тип операции',
  department_id: 'Идентификатор отдела',
  position_id: 'Идентификатор должности',
  salary: 'Зарплата',
  created_at: null,
  updated_at: null,
  deleted_at: null,
};

export function renameFields(fields: string[]): string[] {
  return fields
    .map((field) => fieldLabels[field] || field)
    .filter((field) => fieldLabels[field]);
}
