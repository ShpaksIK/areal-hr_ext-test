import type { EntityType, Organization, Department, Position } from '../types/models';

const API_BASE = 'http://localhost:3000';

const endpoints = {
  organization: `${API_BASE}/organization`,
  department: `${API_BASE}/department`,
  position: `${API_BASE}/position`
};

export interface EntitySavePayload {
  id?: number;
  name: string;
  comment?: string;
  organizationId?: number | null;
  parentDepartmentId?: number | null;
}

const buildBody = (
  type: EntityType,
  payload: EntitySavePayload
): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    id: payload.id,
    name: payload.name
  };

  if (payload.comment) {
    body.comment = payload.comment;
  }

  if (payload.organizationId) {
    body.organization_id = payload.organizationId;
  }

  if (payload.parentDepartmentId) {
    body.parent_id = payload.parentDepartmentId;
  }

  return body;
};

export const fetchAllEntities = async (): Promise<{
  organizations: Organization[];
  departments: Department[];
  positions: Position[];
}> => {
  const [orgsResponse, depsResponse, posResponse] = await Promise.all([
    fetch(endpoints.organization),
    fetch(endpoints.department),
    fetch(endpoints.position)
  ]);

  if (!orgsResponse.ok || !depsResponse.ok || !posResponse.ok) {
    throw new Error('Ошибка загрузки данных');
  }

  const [organizationsRaw, departmentsRaw, positions] = await Promise.all([
    orgsResponse.json(),
    depsResponse.json(),
    posResponse.json()
  ]);

  const organizations = organizationsRaw as Organization[];

  const departments = (departmentsRaw).map((dept: Department) => {
    const normalized: Department = {
      ...dept,
      organizationId:
        dept.organizationId,
      parentDepartmentId:
        dept.parentDepartmentId ??
        (dept.parentDepartment?.id as number | undefined | null) ??
        null,
      organization: dept.organization || null,
      parentDepartment: dept.parentDepartment || null
    };
    return normalized;
  }) as Department[];

  return {
    organizations,
    departments,
    positions
  };
};

export const fetchReferenceData = async (): Promise<{
  organizations: Organization[];
  departments: Department[];
}> => {
  const [orgsResponse, depsResponse] = await Promise.all([
    fetch(endpoints.organization),
    fetch(endpoints.department)
  ]);

  if (!orgsResponse.ok || !depsResponse.ok) {
    throw new Error('Ошибка загрузки справочных данных');
  }

  const [organizationsRaw, departmentsRaw] = await Promise.all([
    orgsResponse.json(),
    depsResponse.json()
  ]);

  const organizations = organizationsRaw as Organization[];

  const departments = (departmentsRaw).map((dept: Department) => {
    const normalized: Department = {
      ...dept,
      organizationId:
        dept.organizationId,
      parentDepartmentId:
        dept.parentDepartmentId ??
        (dept.parentDepartment?.id as number | undefined | null) ??
        null,
      organization: dept.organization || null,
      parentDepartment: dept.parentDepartment || null
    };
    return normalized;
  }) as Department[];

  return {
    organizations,
    departments
  };
};

export const deleteEntity = async (
  type: EntityType,
  id: number
): Promise<void> => {
  const response = await fetch(`${endpoints[type]}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Ошибка удаления');
  }
};

export const updateEntity = async (
  type: EntityType,
  payload: EntitySavePayload
): Promise<void> => {
  const body = buildBody(type, payload);

  const response = await fetch(`${endpoints[type]}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Ошибка сохранения');
  }
};

export const createEntity = async (
  type: EntityType,
  payload: EntitySavePayload
): Promise<void> => {
  const body = buildBody(type, payload);

  delete body.id;

  const response = await fetch(endpoints[type], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Ошибка создания');
  }
};
