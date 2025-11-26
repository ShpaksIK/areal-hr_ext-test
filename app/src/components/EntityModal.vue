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
            :rules="[val => !!val || 'Обязательное поле']"
            class="q-mb-md"
          />
          <q-input
            v-model="form.comment"
            label="Комментарий"
            type="textarea"
            autogrow
          />
        </div>

        <div v-if="entityType === 'department'">
          <q-input
            v-model="form.name"
            label="Название *"
            :rules="[val => !!val || 'Обязательное поле']"
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
            :rules="[val => !!val || 'Обязательное поле']"
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
            :rules="[val => !!val || 'Обязательное поле']"
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
  DepartmentForm
} from '../types/models';
import { fetchReferenceData } from '../api/entities';

interface FormData {
  id: number;
  name: string;
  comment?: string;
  organizationId?: number | null;
  parentDepartmentId?: number | null;
}

interface Props {
  modelValue: boolean;
  mode: ModalMode;
  entityType: EntityType;
  editData: Organization | Department | Position | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', payload: FormData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showModal = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const organizations = ref<Organization[]>([]);
const departments = ref<Department[]>([]);
const form = ref<FormData>({
  id: -1,
  name: '',
  comment: '',
  organizationId: null,
  parentDepartmentId: null
});

const modalTitle = computed<string>(() => {
  const typeNames: Record<EntityType, string> = {
    organization: 'организацию',
    department: 'отдел',
    position: 'должность'
  };
  const action = props.mode === 'add' ? 'Добавить' : 'Изменить';
  return `${action} ${typeNames[props.entityType]}`;
});

const filteredDepartments = computed<Department[]>(() => {
  if (!form.value.organizationId) return [];
  
  return departments.value.filter(
    (dept: Department) => 
      dept.organizationId === form.value.organizationId &&
      dept.id !== form.value.id
  );
});

const loadReferenceData = async (): Promise<void> => {
  try {
    const { organizations: orgs, departments: deps } = await fetchReferenceData();
    organizations.value = orgs;
    departments.value = deps;
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
    parentDepartmentId: null
  };
};

const closeModal = (): void => {
  showModal.value = false;
  resetForm();
};

const save = (): void => {
  if (!form.value.name) {
    return;
  }

  if (props.entityType === 'department' && !form.value.organizationId) {
    return;
  }

  emit('save', { ...form.value });
};

watch(() => props.editData, (newData: Organization | Department | Position | null) => {
  if (newData && props.mode === 'edit') {
    form.value = { ...newData };
    
    if (props.entityType === 'department') {
      const departmentData = newData as Department;
      const departmentForm = form.value as DepartmentForm;
      departmentForm.organizationId = departmentData.organization?.id || departmentData.organizationId;
      if (departmentData.parentDepartment?.id) {
          departmentForm.parentDepartmentId = departmentData.parentDepartment?.id;
      }
    }
  }
}, { immediate: true });

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