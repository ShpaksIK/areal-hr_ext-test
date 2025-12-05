<template>
  <div class="main-page">
    <q-tabs v-model="activeTab" class="bg-primary text-white" align="left">
      <q-tab name="organization" label="Организации" />
      <q-tab name="department" label="Отделы" />
      <q-tab name="position" label="Должности" />
      <q-tab name="employee" label="Сотрудники" />
      <q-tab name="file" label="Файлы" />
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
    >
      <template v-slot:top>
        <q-space />
        <q-btn color="primary" label="Добавить" @click="openAddModal" />
        <q-btn
          color="secondary"
          label="Изменить"
          :disable="!hasSelection"
          @click="editItem"
          class="q-ml-sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          :disable="!hasSelection"
          @click="openDeleteConfirm"
          class="q-ml-sm"
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
  File,
  SaveData,
} from '../types/models';
import {
  fetchAllEntities,
  deleteEntity as apiDeleteEntity,
  updateEntity,
  createEntity,
} from '../api/entities';

const activeTab = ref<EntityType>('organization');
const organizations = ref<Organization[]>([]);
const departments = ref<Department[]>([]);
const positions = ref<Position[]>([]);
const employees = ref<Employee[]>([]);
const files = ref<File[]>([]);
const selectedRows = ref<(Organization | Department | Position)[]>([]);
const showModal = ref<boolean>(false);
const modalMode = ref<ModalMode>('add');
const editData = ref<Organization | Department | Position | Employee | File | null>(null);
const showDeleteConfirm = ref<boolean>(false);
const isDeleting = ref<boolean>(false);

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
  const parentId = department.parentDepartment?.id;

  if (!parentId) {
    return '-';
  }
  const parent =
    department.parentDepartment || departments.value.find((item) => item.id === parentId);
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
      },
    ],
    employee: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'fio', label: 'ФИО', field: 'fio', align: 'left', sortable: true },
      { name: 'passport', label: 'Паспорт', field: 'passport', align: 'left', sortable: true },
      { name: 'address', label: 'Адрес', field: 'address', align: 'left', sortable: true },
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
      },
    ],
    file: [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'name', label: 'Название', field: 'name', align: 'left', sortable: true },
      { name: 'employee', label: 'Сотрудник', field: 'employee', align: 'left', sortable: true },
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
    const {
      organizations: orgs,
      departments: deps,
      positions: pos,
      employess: emp,
      files: fls,
    } = await fetchAllEntities();

    organizations.value = orgs;

    departments.value = deps.map((dept) => {
      const department: Department = { ...dept };

      if (!department.organization && department.organizationId) {
        department.organization = orgs.find((org) => org.id === department.organizationId) || null;
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
        address: `Обл. ${employee.address_region}, г. ${employee.address_city}, ул. ${employee.address_street}, д. ${employee.address_house} ${employee.address_building ? 'ст. ' + employee.address_building : ''} ${employee.address_apartment ? ', кв. ' + employee.address_apartment : ''}`,
      };
    });

    files.value = fls.map((file) => {
      const foundEmployee = employees.value.find((emp) => emp.id === file.employee_id);
      const employeeName = `(${foundEmployee?.id}) ${foundEmployee?.last_name} ${foundEmployee?.first_name} ${foundEmployee?.patronymic}`;

      return {
        ...file,
        employee: employeeName,
      };
    });
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
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
};

const editItem = (): void => {
  if (!hasSelection.value || !selectedItem.value) return;

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
      await updateEntity(activeTab.value, payload);
    } else {
      await createEntity(activeTab.value, payload);
    }

    await loadData();
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    return;
  }

  showModal.value = false;
  selectedRows.value = [];
  editData.value = null;
};

onMounted(loadData);

watch(activeTab, () => {
  selectedRows.value = [];
  showDeleteConfirm.value = false;
});
</script>
