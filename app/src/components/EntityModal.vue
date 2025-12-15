<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">
          {{ modalTitle }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="entityType === 'organization'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 255 || 'Максимум 255 символов',
            ]"
            class="q-mb-md"
          />
          <q-input
            v-model="form.comment"
            label="Комментарий"
            type="textarea"
            :rules="[(val) => val.length <= 255 || 'Максимум 255 символов']"
            maxlength="255"
            autogrow
          />
        </div>

        <div v-if="entityType === 'department'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 255 || 'Максимум 255 символов',
            ]"
            class="q-mb-md"
          />
          <q-input
            v-model="form.comment"
            label="Комментарий"
            type="textarea"
            autogrow
            class="q-mb-md"
            :rules="[(val) => val.length <= 255 || 'Максимум 255 символов']"
            maxlength="255"
            hint="Необязательно"
          />
          <q-select
            v-model="form.organization_id"
            :options="organizations"
            option-label="name"
            option-value="id"
            label="Организация *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-select
            v-model="form.parent_id"
            :options="filteredDepartmentsByOrganizations"
            label="Родительский отдел"
            emit-value
            map-options
            clearable
            hint="Необязательно"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  Нет отделов для выбранной организации
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div v-if="entityType === 'position'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 255 || 'Максимум 255 символов',
            ]"
          />
        </div>

        <div v-if="entityType === 'employee'">
          <q-input
            v-model="form.last_name"
            label="Фамилия *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 50 || 'Максимум 50 символов',
            ]"
            class="q-mb-md"
          />
          <q-input
            v-model="form.first_name"
            label="Имя *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 50 || 'Максимум 50 символов',
            ]"
            class="q-mb-md"
          />
          <q-input
            v-model="form.patronymic"
            label="Отчество"
            hint="Необязательно"
            class="q-mb-md"
            :rules="[(val) => val.length <= 50 || 'Максимум 50 символов']"
          />
          <q-input
            v-model="form.birth_date"
            label="Дата рождения *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
            readonly
            clearable
            @clear="clearBirthDate"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="selectedBirthDate"
                    mask="YYYY-MM-DD"
                    today-btn
                    minimal
                    @update:model-value="onBirthDateSelected"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="form.passport_series"
            label="Серия паспорта *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => (val && val.length === 4) || 'Серия должна содержать 4 цифры',
            ]"
            mask="####"
            maxlength="4"
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.passport_number"
            label="Номер паспорта *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => (val && val.length === 6) || 'Номер должен содержать 6 цифр',
            ]"
            mask="######"
            maxlength="6"
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.passport_issue_date"
            label="Дата выдачи *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
            readonly
            clearable
            @clear="clearIssueDate"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="issueDate"
                    mask="YYYY-MM-DD"
                    today-btn
                    minimal
                    @update:model-value="onIssueDateSelected"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="form.passport_division_code"
            label="Код подразделения *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => (val && val.length === 7) || 'Код должен содержать 6 цифр',
            ]"
            mask="###-###"
            hint="Формат: XXX-XXX"
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.passport_issued_by"
            label="Кем выдан *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 255 || 'Максимум 255 символов',
            ]"
            type="textarea"
            autogrow
            maxlength="255"
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.address_region"
            label="Регион (область, край, республика) *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 50 || 'Максимум 50 символов',
            ]"
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.address_city"
            label="Населенный пункт (город, село) *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => (val && val.length >= 2) || 'Минимум 2 символа',
              (val) => val.length <= 50 || 'Максимум 50 символов',
            ]"
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.address_street"
            label="Улица *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 50 || 'Максимум 50 символов',
            ]"
            class="q-mb-md"
            clearable
          />
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input
                v-model="form.address_house"
                label="Дом *"
                :rules="[
                  (val) => !!val || 'Обязательное поле',
                  (val) => val.length <= 50 || 'Максимум 50 символов',
                ]"
                lazy-rules
                clearable
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.address_building"
                label="Корпус/строение"
                hint="Необязательно"
                clearable
              />
            </div>
          </div>
          <q-input
            v-model="form.address_apartment"
            label="Квартира"
            clearable
            hint="Необязательно"
            :rules="[(val) => val.length <= 50 || 'Максимум 50 символов']"
          />
        </div>

        <div v-if="entityType === 'file'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 255 || 'Максимум 255 символов',
            ]"
            class="q-mb-md"
          />
          <q-select
            v-model="form.employee_id"
            :options="employees"
            label="Сотрудник *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-file
            v-model="form.file"
            label="Выберите файл *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
        </div>

        <div v-if="entityType === 'employmentOperation'">
          <q-select
            v-model="form.employee_id"
            :options="employees"
            label="Сотрудник *"
            emit-value
            map-options
            clearable
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-select
            v-model="form.operation_type"
            :options="operationTypes"
            label="Тип операции *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-select
            v-model="form.department_id"
            :options="departments"
            option-label="name"
            option-value="id"
            label="Отдел *"
            emit-value
            map-options
            clearable
            hint="Необязательно"
            class="q-mb-md"
          />
          <q-select
            v-model="form.position_id"
            :options="positions"
            option-label="name"
            option-value="id"
            label="Должность *"
            emit-value
            map-options
            clearable
            hint="Необязательно"
            class="q-mb-md"
          />
          <q-input v-model="form.salary" label="Зарплата" hint="Необязательно" class="q-mb-md" />
        </div>

        <div v-if="entityType === 'user'">
          <q-input
            v-model="form.last_name"
            label="Фамилия *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 50 || 'Максимум 50 символов',
            ]"
            class="q-mb-md"
          />
          <q-input
            v-model="form.first_name"
            label="Имя *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 50 || 'Максимум 50 символов',
            ]"
            class="q-mb-md"
          />
          <q-input
            v-model="form.patronymic"
            label="Отчество"
            hint="Необязательно"
            class="q-mb-md"
            :rules="[(val) => val.length <= 50 || 'Максимум 50 символов']"
          />
          <q-select
            v-model="form.role_id"
            :options="rolesTable"
            label="Роль *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-input
            v-model="form.login"
            label="Логин"
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 255 || 'Максимум 255 символов'
            ]"
          />
          <q-input
            v-model="form.password"
            label="Пароль"
            class="q-mb-md"
            type="password"
            :style="{ display: props.mode === 'edit' ? 'none' : '' }"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 255 || 'Максимум 255 символов'
            ]"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" @click="closeModal" />
        <q-btn flat label="Сохранить" color="primary" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type {
  Organization,
  Department,
  EntityType,
  ModalMode,
  Position,
  Employee,
  FileType,
  SaveData,
  History,
  EmploymentOperation,
  User,
  Role,
} from '../types/models';
import { fetchReferenceData } from '../api/entities';
import { useQuasar } from 'quasar';

interface Props {
  modelValue: boolean;
  mode: ModalMode;
  entityType: EntityType;
  editData:
    | Organization
    | Department
    | Position
    | Employee
    | FileType
    | History
    | EmploymentOperation
    | User
    | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', payload: SaveData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showModal = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const emptyFormData = {
  id: -1,
  employee_id: null,
  name: '',
  comment: '',
  organization_id: null,
  parent_id: null,
  parentDepartmentId: null,
  first_name: '',
  last_name: '',
  patronymic: null,
  birth_date: '',
  passport_series: '',
  passport_number: '',
  passport_issue_date: '',
  passport_division_code: '',
  passport_issued_by: '',
  address_region: '',
  address_city: '',
  address_street: '',
  address_house: '',
  address_building: null,
  address_apartment: null,
  salary: null,
  operation_type: null,
  department_id: null,
  position_id: null,
  entity_type: null,
  entity_id: null,
  changed_fields: [],
  file: null,
  password: null,
  user_id: null,
};

const $q = useQuasar();
const organizations = ref<Organization[]>([]);
const employees = ref<Employee[]>([]);
const departments = ref<Department[]>([]);
const positions = ref<Position[]>([]);
const roles = ref<Role[]>([]);
const rolesTable = ref<{
  label: string;
  value: number;
}[]>([]);
const form = ref<SaveData>({ ...emptyFormData });

const operationTypes = [
  { label: 'Добавление', value: 'create' },
  { label: 'Увольнение', value: 'dismissal' },
  { label: 'Изменение зарплаты', value: 'salaryChanges' },
  { label: 'Изменение отдела', value: 'departmentChanges' },
];

const modalTitle = computed<string>(() => {
  const typeNames: Record<EntityType, string> = {
    organization: 'организацию',
    department: 'отдел',
    position: 'должность',
    employee: 'сотрудник',
    file: 'файл',
    history: 'историю',
    employmentOperation: 'кадровую операцию',
    user: 'пользователя'
  };
  const action = props.mode === 'add' ? 'Добавить' : 'Изменить';
  return `${action} ${typeNames[props.entityType]}`;
});

const filteredDepartmentsByOrganizations = computed<{ label: string; value: number }[]>(() => {
  if (!form.value.organization_id) return [];

  return departments.value
    .filter(
      (dept: Department) =>
        dept.organization_id === form.value.organization_id &&
        form.value.id !== dept.id &&
        !dept.deleted_at,
    )
    .map((dept: Department) => ({
      label: dept.name,
      value: dept.id,
    }));
});

const selectedBirthDate = ref<string>('');
const clearBirthDate = (): void => {
  form.value.birth_date = '';
  selectedBirthDate.value = '';
};
const onBirthDateSelected = (): void => {
  form.value.birth_date = selectedBirthDate.value;
};

const issueDate = ref<string>('');
const clearIssueDate = (): void => {
  form.value.passport_issue_date = '';
  issueDate.value = '';
};
const onIssueDateSelected = (): void => {
  form.value.passport_issue_date = issueDate.value;
};

const loadReferenceData = async (): Promise<void> => {
  try {
    const {
      organizations: orgs,
      departments: deps,
      employees: emps,
      positions: pos,
      roles: rols,
    } = await fetchReferenceData();
    organizations.value = orgs.filter((org: Organization) => !org.deleted_at);
    departments.value = deps.filter((dep: Department) => !dep.deleted_at);
    employees.value = emps;
    positions.value = pos.filter((pos: Position) => !pos.deleted_at);
    roles.value = rols;
    rolesTable.value = rols.map((role: Role) => ({
      label: role.name,
      value: role.id
    }));
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    $q.notify('Ошибка загрузки данных');
  }
};

const resetForm = (): void => {
  form.value = { ...emptyFormData };
};

const closeModal = (): void => {
  showModal.value = false;
  resetForm();
};

const save = (): void => {
  if (props.entityType === 'department' && !form.value.organization_id) {
    return;
  }

  if (props.mode === 'edit') {
    form.value.user_id = 1;
  }

  emit('save', { ...form.value });
};

watch(
  () => props.editData,
  (
    newData:
      | Organization
      | Department
      | Position
      | Employee
      | FileType
      | History
      | EmploymentOperation
      | User
      | null,
  ) => {
    if (newData && props.mode === 'edit') {
      form.value = { ...newData };
    }
  },
  { immediate: true },
);

watch(showModal, async (newVal: boolean) => {
  if (newVal) {
    if (props.mode === 'add') {
      resetForm();
    }

    await loadReferenceData();
  }
});

onMounted(loadReferenceData);
</script>
