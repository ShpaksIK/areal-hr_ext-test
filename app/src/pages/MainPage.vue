<template>
  <div class="main-page">
    <q-tabs v-model="activeTab" class="bg-primary text-white" align="left">
      <q-tab name="organization" label="Организации" />
      <q-tab name="department" label="Отделы" />
      <q-tab name="position" label="Должности" />
      <q-tab name="employee" label="Сотрудники" />
      <q-tab name="file" label="Файлы" />
      <q-tab name="employmentOperation" label="Кадровые операции" />
      <q-tab name="history" label="История" />
      <q-tab 
        name="user" 
        label="Пользователи" 
        :style = "{
          display: userRole.name !== 'Администратор' ? 'none': '',
        }"
        />
    </q-tabs>

    <q-table
      class="q-mt-md"
      :rows="currentData"
      :columns="columns"
      row-key="id"
      selection="single"
      v-model:selected="selectedRows"
      no-data-label="Данные пока не загружены"
      rows-per-page-label="Записей на странице"
      :pagination-label="paginationLabel"
      :selected-rows-label="selectedRowsLabel"
      :table-row-style-fn="rowStyleFn"
    >
      <template v-slot:top>
        <q-btn
          color="dark"
          label="Выйти"
          @click="onLogout"
          class="q-ml-sm"
        />
        <q-space />
        <q-btn
          color="primary"
          label="Добавить"
          :disable="isOpenHistory"
          @click="openAddModal"
          :style="{
            display: activeTab === 'history' ? 'none' : '',
          }"
        />
        <q-btn
          color="secondary"
          label="Изменить"
          :disable="!hasSelection"
          @click="editItem"
          class="q-ml-sm"
          :style="{
            display: activeTab === 'history' ? 'none' : '',
          }"
        />
        <q-btn
          color="negative"
          label="Удалить"
          :disable="!hasSelection"
          @click="openDeleteConfirm"
          class="q-ml-sm"
          :style="{
            display: activeTab === 'employmentOperation' ? 'none' : '',
          }"
        />
      </template>
    </q-table>

    <EntityModal
      v-model="showModal"
      :mode="modalMode"
      :entity-type="activeTab"
      :edit-data="editData"
      @save="handleSave"
    />

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Подтверждение удаления</div>
        </q-card-section>
        <q-card-section>
          <div>
            Вы действительно хотите удалить
            {{ typeNames[activeTab] }}?
          </div>
          <div class="text-caption text-grey-7 q-mt-sm">Действие нельзя отменить.</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Отмена"
            color="primary"
            :disable="isDeleting"
            @click="showDeleteConfirm = false"
          />
          <q-btn flat label="Удалить" color="negative" :loading="isDeleting" @click="deleteItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import EntityModal from '../components/EntityModal.vue';
import type {
  Organization,
  Department,
  Position,
  EntityType,
  TableColumn,
  ModalMode,
  Entity,
  Employee,
  SaveData,
  History,
  EmploymentOperation,
  FileType,
  User,
  Role,
} from '../types/models';
import {
  fetchAllEntities,
  deleteEntity as apiDeleteEntity,
  updateEntity,
  createEntity,
  getMe,
} from '../api/entities';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import '../api/create-test-entity';
import { setAuthToken } from 'src/api/local-storage';

const $q = useQuasar();
const router = useRouter();

const userRole = ref<Role>({
  'id': -1,
  'name': ''
});
const activeTab = ref<EntityType>('organization');
const organizations = ref<Organization[]>([]);
const departments = ref<Department[]>([]);
const positions = ref<Position[]>([]);
const employees = ref<Employee[]>([]);
const files = ref<FileType[]>([]);
const history = ref<History[]>([]);
const users = ref<User[]>([]);
const employmentOperation = ref<EmploymentOperation[]>([]);
const selectedRows = ref<
  (
    | Organization
    | Department
    | Position
    | FileType
    | History
    | Employee
    | EmploymentOperation
    | User
  )[]
>([]);
const showModal = ref<boolean>(false);
const modalMode = ref<ModalMode>('add');
const editData = ref<
  | Organization
  | Department
  | Position
  | Employee
  | FileType
  | History
  | EmploymentOperation
  | User
  | null
>(null);
const showDeleteConfirm = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const isOpenHistory = ref<boolean>(false);
const isOpenEmploymentOperations = ref<boolean>(false);

type SavePayload = SaveData;

const hasSelection = computed<boolean>(() =>
  selectedRows.value.some((row) => !(row as Entity).deleted_at),
);

const selectedItem = computed<Entity | null>(() => {
  const active = selectedRows.value.find((row) => !(row as Entity).deleted_at) as
    | Entity
    | undefined;
  return active ?? null;
});

const currentData = computed<Entity[]>(() => {
  switch (activeTab.value) {
    case 'organization':
      return organizations.value;
    case 'department':
      return departments.value;
    case 'position':
      return positions.value;
    case 'employee':
      return employees.value;
    case 'file':
      return files.value;
    case 'history':
      return history.value;
    case 'employmentOperation':
      return employmentOperation.value;
    case 'user':
      return users.value;
    default:
      return [];
  }
});

const formatStatus = (deletedAt?: string | null): string => {
  if (!deletedAt) {
    return 'активно';
  }

  const date = new Date(deletedAt);
  const formatted = Number.isNaN(date.getTime()) ? deletedAt : date.toLocaleString();
  return `удалено (${formatted})`;
};

const getOrganizationName = (department: Department): string => {
  const org =
    department.organization ||
    organizations.value.find((item) => item.id === department.organization_id);
  return org?.name || '-';
};

const getParentDepartmentName = (department: Department): string => {
  const parentId = department.parent_id;

  const parent = departments.value.find((item) => item.id === parentId);

  return parent?.name || '-';
};

const columns = computed<TableColumn[]>(() => {
  const baseColumns: Record<EntityType, TableColumn[]> = {
    organization: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
      { name: 'comment', label: 'Комментарий', field: 'comment', align: 'left' },
      {
        name: 'created_at',
        label: 'Создано',
        field: (row: Entity) => formatDate((row as Organization).created_at),
        align: 'left',
      },
      {
        name: 'updated_at',
        label: 'Изменено',
        field: (row: Entity) => formatDate((row as Organization).updated_at),
        align: 'left',
      },
      {
        name: 'status',
        label: 'Статус',
        field: (row: Entity) => formatStatus((row as Organization).deleted_at ?? null),
        align: 'left',
        sortable: true,
      },
    ],
    department: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
      { name: 'comment', label: 'Комментарий', field: 'comment', align: 'left' },
      {
        name: 'organization',
        label: 'Организация',
        field: (row: Entity) => getOrganizationName(row as Department),
        align: 'left',
      },
      {
        name: 'parent',
        label: 'Родительский отдел',
        field: (row: Entity) => getParentDepartmentName(row as Department),
        align: 'left',
      },
      {
        name: 'created_at',
        label: 'Создано',
        field: (row: Entity) => formatDate((row as Department).created_at),
        align: 'left',
      },
      {
        name: 'updated_at',
        label: 'Изменено',
        field: (row: Entity) => formatDate((row as Department).updated_at),
        align: 'left',
      },
      {
        name: 'status',
        label: 'Статус',
        field: (row: Entity) => formatStatus((row as Department).deleted_at ?? null),
        align: 'left',
        sortable: true,
      },
    ],
    position: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
      {
        name: 'created_at',
        label: 'Создано',
        field: (row: Entity) => formatDate((row as Position).created_at),
        align: 'left',
      },
      {
        name: 'updated_at',
        label: 'Изменено',
        field: (row: Entity) => formatDate((row as Position).updated_at),
        align: 'left',
      },
      {
        name: 'status',
        label: 'Статус',
        field: (row: Entity) => formatStatus((row as Position).deleted_at ?? null),
        align: 'left',
        sortable: true,
      },
    ],
    employee: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'fio', label: 'ФИО', field: 'fio', align: 'left', sortable: true },
      {
        name: 'passport',
        label: 'Паспорт',
        field: 'passport',
        align: 'left',
        classes: 'text-wrap',
        sortable: true,
      },
      {
        name: 'address',
        label: 'Адрес',
        field: 'address',
        align: 'left',
        classes: 'text-wrap',
        sortable: true,
      },
      {
        name: 'created_at',
        label: 'Создано',
        field: (row: Entity) => formatDate((row as Employee).created_at),
        align: 'left',
      },
      {
        name: 'updated_at',
        label: 'Изменено',
        field: (row: Entity) => formatDate((row as Employee).updated_at),
        align: 'left',
      },
      {
        name: 'status',
        label: 'Статус',
        field: (row: Entity) => formatStatus((row as Employee).deleted_at ?? null),
        align: 'left',
        sortable: true,
      },
    ],
    file: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
      { name: 'employee', label: 'Сотрудник', field: 'employee', align: 'left', sortable: true },
      {
        name: 'created_at',
        label: 'Создано',
        field: (row: Entity) => formatDate((row as FileType).created_at),
        align: 'left',
      },
      {
        name: 'updated_at',
        label: 'Изменено',
        field: (row: Entity) => formatDate((row as FileType).updated_at),
        align: 'left',
      },
      {
        name: 'status',
        label: 'Статус',
        field: (row: Entity) => formatStatus((row as FileType).deleted_at ?? null),
        align: 'left',
        sortable: true,
      },
    ],
    history: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      {
        name: 'user_id',
        label: 'ID Пользователя',
        field: 'user_id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'entity_type',
        label: 'Тип сущности',
        field: 'entity_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'entity_id',
        label: 'ID сущности',
        field: 'entity_id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'changed_fields',
        label: 'Измененные поля',
        field: 'changed_fields',
        align: 'left',
        classes: 'text-wrap',
        sortable: true,
      },
      {
        name: 'created_at',
        label: 'Создано',
        field: (row: Entity) => formatDate((row as History).created_at),
        align: 'left',
      },
      {
        name: 'status',
        label: 'Статус',
        field: (row: Entity) => formatStatus((row as History).deleted_at ?? null),
        align: 'left',
        sortable: true,
      },
    ],
    employmentOperation: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'fio', label: 'Сотрудник', field: 'fio', align: 'left', sortable: true },
      {
        name: 'operation_type',
        label: 'Тип операции',
        field: 'operationType',
        align: 'left',
        sortable: true,
      },
      {
        name: 'department_name',
        label: 'Отдел',
        field: 'department_name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'position_name',
        label: 'Должность',
        field: 'position_name',
        align: 'left',
        sortable: true,
      },
      { name: 'salary', label: 'Зарплата', field: 'salary', align: 'left', sortable: true },
    ],
    user: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'fio', label: 'Пользователь', field: 'fio', align: 'left', sortable: true },
      { name: 'login', label: 'Логин', field: 'login', align: 'left', sortable: true },
      {
        name: 'role',
        label: 'Роль',
        field: 'role',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        label: 'Создано',
        field: (row: Entity) => formatDate((row as FileType).created_at),
        align: 'left',
      },
      {
        name: 'updated_at',
        label: 'Изменено',
        field: (row: Entity) => formatDate((row as FileType).updated_at),
        align: 'left',
      },
      {
        name: 'status',
        label: 'Статус',
        field: (row: Entity) => formatStatus((row as FileType).deleted_at ?? null),
        align: 'left',
        sortable: true,
      },
    ],
  };

  return baseColumns[activeTab.value] || [];
});

const paginationLabel = (start: number, end: number, total: number): string => {
  return `${start}-${end} из ${total}`;
};

const selectedRowsLabel = (numberOfRows: number): string => {
  if (numberOfRows <= 0) {
    return '';
  }

  const word = numberOfRows === 1 ? 'запись' : 'записи';
  return `Выбрана ${numberOfRows} ${word}`;
};

const formatDate = (value?: string | null): string => {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const loadData = async (): Promise<void> => {
  try {
    try {
      const me = await getMe();
      if (!me.success) {
        throw new Error('Срок действия токена истек. Войдите заново');
      }
      userRole.value = {
        name: me.data.name,
        id: me.data.role_id
      }
      console.log(userRole)
    } catch {
      setAuthToken('');
      await router.push('/login');
    }

    const {
      organizations: orgs,
      departments: deps,
      positions: pos,
      employess: emp,
      files: fls,
      history: hst,
      employmentOperation: empOp,
      users: usrs,
    } = await fetchAllEntities();

    organizations.value = orgs;

    departments.value = deps.map((dept) => {
      const department: Department = { ...dept };

      if (!department.organization && department.organization_id) {
        department.organization = orgs.find((org) => org.id === department.organization_id) || null;
      }

      if (!department.parentDepartment && department.parentDepartmentId) {
        department.parentDepartment =
          deps.find((d) => d.id === department.parentDepartmentId) || null;
      }

      return department;
    });

    positions.value = pos;

    employees.value = emp.map((employee) => {
      const [year, month, day] = employee.passport_issue_date.slice(0, 10).split('-');
      const passportIssueDate = `${day}.${month}.${year}`;

      return {
        ...employee,
        fio: `${employee.last_name} ${employee.first_name} ${employee.patronymic || ''} `,
        passport: `${employee.passport_series} ${employee.passport_number}, выдан ${employee.passport_issued_by}, код ${employee.passport_division_code}, дата ${passportIssueDate}`,
        address: `Обл. ${employee.address_region}, г. ${employee.address_city}, ул. ${employee.address_street}, д. ${employee.address_house} ${employee.address_building ? 'стр. ' + employee.address_building : ''} ${employee.address_apartment ? ', кв. ' + employee.address_apartment : ''}`,
      };
    });

    files.value = fls.map((file) => {
      const foundEmployee = employees.value.find((emp) => emp.id === file.employee_id);
      const employeeName = `${foundEmployee?.last_name} ${foundEmployee?.first_name} ${foundEmployee?.patronymic || ''}`;

      return {
        ...file,
        employee: employeeName,
      };
    });

    history.value = hst;
    employmentOperation.value = empOp;
    users.value = usrs;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    $q.notify('Ошибка загрузки данных');
  }
};

const openAddModal = (): void => {
  modalMode.value = 'add';
  editData.value = null;
  showModal.value = true;
};

const typeNames: Record<EntityType, string> = {
  organization: 'организацию',
  department: 'отдел',
  position: 'должность',
  employee: 'сотрудника',
  file: 'файл',
  history: 'историю',
  employmentOperation: 'кадровую операцию',
  user: 'пользователя',
};

const editItem = (): void => {
  if (!hasSelection.value || !selectedItem.value) return;

  if (isOpenHistory.value) return;

  modalMode.value = 'edit';
  editData.value = { ...selectedItem.value };
  showModal.value = true;
};

const openDeleteConfirm = (): void => {
  if (!hasSelection.value || !selectedItem.value) return;
  showDeleteConfirm.value = true;
};

const deleteItem = async (): Promise<void> => {
  if (!hasSelection.value || !selectedItem.value) return;

  const item = selectedItem.value;
  isDeleting.value = true;

  try {
    await apiDeleteEntity(activeTab.value, item.id);
    await loadData();
    selectedRows.value = [];
    editData.value = null;
  } catch (error) {
    console.error('Ошибка удаления:', error);
    $q.notify('Ошибка удаления');
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
  }
};

const handleSave = async (payload: SavePayload): Promise<void> => {
  try {
    if (modalMode.value === 'edit') {
      if (!editData.value) {
        return;
      }

      if (activeTab.value === 'employmentOperation') {
        await createEntity(activeTab.value, payload);
      } else {
        await updateEntity(activeTab.value, payload);
      }
    } else {
      await createEntity(activeTab.value, payload);
    }
  } catch (error) {
    if (modalMode.value === 'add') {
      console.error('Ошибка создания:', error);
      $q.notify('Ошибка создания');
    } else {
      console.error('Ошибка сохранения:', error);
      $q.notify('Ошибка сохранения');
    }
    return;
  }

  await loadData();

  showModal.value = false;
  selectedRows.value = [];
  editData.value = null;
};

const onLogout = async () => {
  setAuthToken('');
  await router.push('/login');
}

onMounted(loadData);

watch(activeTab, () => {
  selectedRows.value = [];
  showDeleteConfirm.value = false;
  if (activeTab.value === 'history') {
    isOpenHistory.value = true;
  } else {
    isOpenHistory.value = false;
  }

  if (activeTab.value === 'employmentOperation') {
    isOpenEmploymentOperations.value = true;
  } else {
    isOpenEmploymentOperations.value = false;
  }
});

const rowStyleFn = (row: Entity) => {
  return row.deleted_at ? 'color: #ccc' : 'color: #000';
};
</script>
