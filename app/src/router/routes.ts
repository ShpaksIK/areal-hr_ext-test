import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MainPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') }
    ],
  },
];

export default routes;
