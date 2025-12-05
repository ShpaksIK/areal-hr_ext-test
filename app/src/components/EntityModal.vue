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
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-input v-model="form.comment" label="Комментарий" type="textarea" autogrow />
        </div>

        <div v-if="entityType === 'department'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-input
            v-model="form.comment"
            label="Комментарий"
            type="textarea"
            autogrow
            class="q-mb-md"
          />
          <q-select
            v-model="form.organizationId"
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
            v-model="form.parentDepartmentId"
            :options="filteredDepartments"
            option-label="name"
            option-value="id"
            label="Родительский отдел"
            emit-value
            map-options
            clearable
          />
        </div>

        <div v-if="entityType === 'position'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[(val) => !!val || 'Обязательное поле']"
          />
        </div>

        <div v-if="entityType === 'employee'">
          <q-input
            v-model="form.last_name"
            label="Фамилия *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-input
            v-model="form.first_name"
            label="Имя *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-input
            v-model="form.patronymic"
            label="Отчество"
            hint="Необязательно"
            class="q-mb-md"
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
              (val) => (val && val.length >= 5) || 'Минимум 5 символов',
            ]"
            type="textarea"
            autogrow
            maxlength="500"
            counter
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.address_region"
            label="Регион (область, край, республика) *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => (val && val.length >= 3) || 'Минимум 3 символа',
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
            ]"
            class="q-mb-md"
            clearable
          />
          <q-input
            v-model="form.address_street"
            label="Улица *"
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => (val && val.length >= 2) || 'Минимум 2 символа',
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
                  (val) => (val && val.length >= 1) || 'Введите номер дома',
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
            label="Квартира/офис"
            hint="Необязательно"
            clearable
          />
        </div>

        <div v-if="entityType === 'file'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-select
            v-model="form.employee_id"
            :options="employees"
            option-label="name"
            option-value="id"
            label="ID сотрудника *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
        </div>

        <div v-if="entityType === 'employmentOperation'">
          <q-select
            v-model="form.employee_id"
            :options="employees"
            option-label="name"
            option-value="id"
            label="ID сотрудника *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-select
            v-model="form.operation_type"
            :options="['Добавление', 'Увольнение', 'Изменение зарплаты', 'Изменение отдела']"
            option-label="name"
            option-value="id"
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
            label="ID отдела *"
            emit-value
            map-options
            hint="Необязательно"
            class="q-mb-md"
          />
          <q-select
            v-model="form.position_id"
            :options="positions"
            option-label="name"
            option-value="id"
            label="ID должности *"
            emit-value
            map-options
            hint="Необязательно"
            class="q-mb-md"
          />
          <q-input
            v-model="form.entity_type"
            label="Зарплата"
            hint="Необязательно"
            class="q-mb-md"
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
  DepartmentForm,
  Employee,
  File,
  SaveData,
  History,
  EmploymentOperation,
} from '../types/models';
import { fetchReferenceData } from '../api/entities';

type FormData = SaveData;

interface Props {
  modelValue: boolean;
  mode: ModalMode;
  entityType: EntityType;
  editData:
    | Organization
    | Department
    | Position
    | Employee
    | File
    | History
    | EmploymentOperation
    | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', payload: FormData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showModal = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const organizations = ref<Organization[]>([]);
const employees = ref<string[]>([]);
const departments = ref<Department[]>([]);
const positions = ref<Position[]>([]);
const form = ref<FormData>({
  id: -1,
  employee_id: null,
  name: '',
  comment: '',
  organizationId: null,
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
});

const modalTitle = computed<string>(() => {
  const typeNames: Record<EntityType, string> = {
    organization: 'организацию',
    department: 'отдел',
    position: 'должность',
    employee: 'сотрудник',
    file: 'файл',
    history: 'историю',
    employmentOperation: 'кадровую операцию',
  };
  const action = props.mode === 'add' ? 'Добавить' : 'Изменить';
  return `${action} ${typeNames[props.entityType]}`;
});

const filteredDepartments = computed<Department[]>(() => {
  if (!form.value.organizationId) return [];

  return departments.value.filter(
    (dept: Department) =>
      dept.organizationId === form.value.organizationId && dept.id !== form.value.id,
  );
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
    } = await fetchReferenceData();
    organizations.value = orgs;
    departments.value = deps;
    employees.value = emps;
    positions.value = pos;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
};

const resetForm = (): void => {
  form.value = {
    id: -1,
    name: '',
    comment: '',
    organizationId: null,
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
    employee_id: null,
    entity_type: null,
    entity_id: null,
    changed_fields: [],
    department_id: null,
    position_id: null,
    salary: null,
    operation_type: null,
  };
};

const closeModal = (): void => {
  showModal.value = false;
  resetForm();
};

const save = (): void => {
  if (props.entityType === 'department' && !form.value.organizationId) {
    return;
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
      | File
      | History
      | EmploymentOperation
      | null,
  ) => {
    if (newData && props.mode === 'edit') {
      form.value = { ...newData };

      if (props.entityType === 'department') {
        const departmentData = newData as Department;
        const departmentForm = form.value as DepartmentForm;
        departmentForm.organizationId =
          departmentData.organization?.id || departmentData.organizationId;
        if (departmentData.parentDepartment?.id) {
          departmentForm.parentDepartmentId = departmentData.parentDepartment?.id;
        }
      }
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
