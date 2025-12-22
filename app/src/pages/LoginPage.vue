<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg" style="width: 100%; max-width: 400px">
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h4 text-weight-bold text-primary">Вход в систему</div>
          <div class="text-caption text-grey">Введите ваши учетные данные</div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            v-model="form.login"
            label="Логин"
            outlined
            dense
            :rules="loginRules"
            lazy-rules
            :error="!!errors.login"
            :error-message="errors.login"
            @update:model-value="clearError('login')"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Пароль"
            :type="isPwd ? 'password' : 'text'"
            outlined
            dense
            :rules="passwordRules"
            lazy-rules
            :error="!!errors.password"
            :error-message="errors.password"
            @update:model-value="clearError('password')"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-banner v-if="serverError" class="bg-negative text-white q-mb-sm" dense rounded>
            <template v-slot:avatar>
              <q-icon name="error" />
            </template>
            {{ serverError }}
          </q-banner>

          <div class="row q-gutter-sm">
            <q-btn
              label="Войти"
              type="submit"
              color="primary"
              class="col-grow"
              :loading="loading"
              :disable="loading"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Отправка...
              </template>
            </q-btn>
          </div>

          <div class="text-center">
            <q-btn
              label="Сбросить форму"
              type="reset"
              flat
              color="grey"
              size="sm"
              :disable="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { login } from 'src/api/entities';
import { setAuthToken } from 'src/api/local-storage';

const $q = useQuasar();
const router = useRouter();

const form = reactive({
  login: '',
  password: '',
});

const isPwd = ref(true);
const loading = ref(false);
const serverError = ref('');

type ErrorType = {
  login: string;
  password: string;
};

type ErrorKeys = keyof ErrorType;

const errors: ErrorType = reactive({
  login: '',
  password: '',
});

const loginRules = [(val: string) => !!val || 'Поле "Логин" обязательно для заполнения'];

const passwordRules = [
  (val: string) => !!val || 'Поле "Пароль" обязательно для заполнения',
  (val: string) => val.length >= 5 || 'Пароль должен содержать минимум 6 символов',
];

const clearError = (field: ErrorKeys) => {
  if (errors[field]) {
    errors[field] = '';
  }
  serverError.value = '';
};

const onReset = () => {
  form.login = '';
  form.password = '';
  serverError.value = '';
};

const onSubmit = async () => {
  serverError.value = '';

  if (!form.login.trim()) {
    errors.login = 'Поле "Логин" обязательно для заполнения';
    return;
  }

  if (!form.password) {
    errors.password = 'Поле "Пароль" обязательно для заполнения';
    return;
  }

  loading.value = true;

  try {
    const response = await login({
      login: form.login.trim(),
      password: form.password
    });

    if (!response.success) {
      throw response.message;
    }

    $q.notify({
      type: 'positive',
      message: response.message || 'Вы успешно вошли',
      position: 'bottom',
    });

    setAuthToken(response.data.sessionToken);

    await router.push('/');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Ошибка авторизации: ${error as string}`,
      position: 'bottom',
    });
  } finally {
    loading.value = false;
  }
};
</script>
