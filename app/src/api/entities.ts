import type {
  EntityType,
  Organization,
  Department,
  Position,
  Employee,
  File,
  SaveData,
  History,
  EmploymentOperation,
} from '../types/models';

const API_BASE = 'http://localhost:3000';

const endpoints = {
  organization: `${API_BASE}/organization`,
  department: `${API_BASE}/department`,
  position: `${API_BASE}/position`,
  employee: `${API_BASE}/employee`,
  file: `${API_BASE}/file`,
  history: `${API_BASE}/history`,
  employmentOperation: `${API_BASE}/employment-operation`,
};

const buildBody = (type: EntityType, payload: SaveData): Record<string, unknown> => {
  const body: Record<string, unknown> = {};
  if (payload.id) {
    body.id = payload.id;
  }

  if (payload.comment) {
    body.comment = payload.comment;
  }

  if (payload.organization_id) {
    body.organization_id = payload.organization_id;
  }

  if (payload.parent_id) {
    body.parent_id = payload.parent_id;
  }

  if (payload.name) {
    body.name = payload.name;
  }

  if (type === 'employee') {
    body.first_name = payload.first_name;
    body.last_name = payload.last_name;
    body.patronymic = payload.patronymic || null;
    body.birth_date = payload.birth_date;
    body.passport_division_code = payload.passport_division_code;
    body.passport_issue_date = payload.passport_issue_date;
    body.passport_issued_by = payload.passport_issued_by;
    body.passport_number = payload.passport_number;
    body.passport_series = payload.passport_series;
    body.address_city = payload.address_city;
    body.address_house = payload.address_house;
    body.address_region = payload.address_region;
    body.address_street = payload.address_street;
    body.address_building = payload.address_building || null;
    body.address_apartment = payload.address_apartment || null;
  }

  if (type === 'file') {
    const employeeId = String(payload.employee_id).slice(0, 1);
    body.employee_id = Number(employeeId);
  }

  if (type === 'employmentOperation') {
    const employeeId = String(payload.employee_id).slice(0, 1);
    body.employee_id = Number(employeeId);
    body.operation_type = payload.operation_type;
    body.department_id = payload.department_id || null;
    body.position_id = payload.position_id || null;
    body.salary = Number(payload.salary);
  }

  return body;
};

export const fetchAllEntities = async (): Promise<{
  organizations: Organization[];
  departments: Department[];
  positions: Position[];
  employess: Employee[];
  files: File[];
  history: History[];
  employmentOperation: EmploymentOperation[];
}> => {
  const [
    orgsResponse,
    depsResponse,
    posResponse,
    empResponse,
    filesResponse,
    historyResponse,
    empOpResponse,
  ] = await Promise.all([
    fetch(endpoints.organization),
    fetch(endpoints.department),
    fetch(endpoints.position),
    fetch(endpoints.employee),
    fetch(endpoints.file),
    fetch(endpoints.history),
    fetch(endpoints.employmentOperation),
  ]);

  if (
    !orgsResponse.ok ||
    !depsResponse.ok ||
    !posResponse.ok ||
    !empResponse.ok ||
    !filesResponse.ok ||
    !historyResponse.ok ||
    !empOpResponse.ok
  ) {
    throw new Error('Ошибка загрузки данных');
  }

  const [
    organizations,
    departmentsRaw,
    positions,
    employess,
    files,
    historyRaw,
    employmentOperationRaw,
  ] = await Promise.all([
    orgsResponse.json(),
    depsResponse.json(),
    posResponse.json(),
    empResponse.json(),
    filesResponse.json(),
    historyResponse.json(),
    empOpResponse.json(),
  ]);

  const departments = departmentsRaw.data.map((dept: Department) => {
    const normalized: Department = {
      ...dept,
      organizationId: dept.organizationId,
      parentDepartmentId:
        dept.parentDepartmentId ?? (dept.parentDepartment?.id as number | undefined | null) ?? null,
      organization: dept.organization || null,
      parentDepartment: dept.parentDepartment || null,
    };
    return normalized;
  }) as Department[];

  const history: History[] = historyRaw.data.map((h: History) => {
    let entityType;
    if (h.entity_type === 'department') {
      entityType = 'Отдел';
    } else if (h.entity_type === 'employmentOperation') {
      entityType = 'Кадровая операция';
    } else if (h.entity_type === 'employee') {
      entityType = 'Сотрудник';
    } else if (h.entity_type === 'file') {
      entityType = 'Файл';
    } else if (h.entity_type === 'history') {
      entityType = 'История';
    } else if (h.entity_type === 'organization') {
      entityType = 'Организация';
    } else if (h.entity_type === 'position') {
      entityType = 'Должность';
    }

    if (typeof h.changed_fields === 'object') {
      return {
        ...h,
        changed_fields: h.changed_fields.join(', '),
        entity_type: entityType
      };
    }
  });

  const employmentOperation = employmentOperationRaw.data.map((empOp: EmploymentOperation) => {
    let operationType;
    if (empOp.operation_type === 'create') {
      operationType = 'Добавление';
    } else if (empOp.operation_type === 'departmentChanges') {
      operationType = 'Изменение отдела';
    } else if (empOp.operation_type === 'dismissal') {
      operationType = 'Увольнение';
    } else {
      operationType = 'Изменение зарплаты';
    }

    return {
      ...empOp,
      operationType,
      fio: `${empOp.employee_last_name} ${empOp.employee_first_name} ${empOp.employee_patronymic || ''}`,
    };
  });

  return {
    organizations: organizations.data,
    departments,
    positions: positions.data,
    employess: employess.data,
    files: files.data,
    history,
    employmentOperation,
  };
};

export const fetchReferenceData = async (): Promise<{
  organizations: Organization[];
  departments: Department[];
  employees: Employee[];
  positions: Position[];
}> => {
  const [orgsResponse, depsResponse, empsResponse, posResponse] = await Promise.all([
    fetch(endpoints.organization),
    fetch(endpoints.department),
    fetch(endpoints.employee),
    fetch(endpoints.position),
  ]);

  if (!orgsResponse.ok || !depsResponse.ok || !empsResponse.ok || !posResponse.ok) {
    throw new Error('Ошибка загрузки справочных данных');
  }

  const [organizationsRaw, departmentsRaw, employeesRaw, positionsRaw] = await Promise.all([
    orgsResponse.json(),
    depsResponse.json(),
    empsResponse.json(),
    posResponse.json(),
  ]);

  const departments = departmentsRaw.data.map((dept: Department) => {
    const normalized: Department = {
      ...dept,
      organization_id: dept.organization_id,
      parentDepartmentId:
        dept.parentDepartmentId ?? (dept.parentDepartment?.id as number | undefined | null) ?? null,
      organization: dept.organization || null,
      parentDepartment: dept.parentDepartment || null,
    };
    return normalized;
  }) as Department[];

  const employees = employeesRaw.data
    .filter((emp: Employee) => !emp.deleted_at)
    .map((emp: Employee) => ({
      label: `${emp.last_name} ${emp.first_name} ${emp.patronymic || ''}`,
      value: emp.id,
    }));

  return {
    organizations: organizationsRaw.data,
    departments,
    employees,
    positions: positionsRaw.data,
  };
};

export const deleteEntity = async (type: EntityType, id: number): Promise<void> => {
  try {
    const response = await fetch(`${endpoints[type]}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Ошибка удаления');
    }
  } catch {
    throw new Error('Ошибка удаления');
  }
};

export const updateEntity = async (type: EntityType, payload: SaveData): Promise<void> => {
  const body = buildBody(type, payload);

  try {
    const response = await fetch(`${endpoints[type]}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Ошибка сохранения');
    }
  } catch {
    throw new Error('Ошибка сохранения');
  }
};

export const createEntity = async (type: EntityType, payload: SaveData): Promise<void> => {
  const body = buildBody(type, payload);

  delete body.id;

  try {
    const response = await fetch(endpoints[type], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Ошибка создания');
    }
  } catch {
    throw new Error('Ошибка создания');
  }
};
