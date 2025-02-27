import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FileList from '../components/FileList.vue';
import FilePreview from '../components/FilePreview.vue';
import Login from '../components/LoginComp.vue';
import FileUploader from '../components/FileUploader.vue';
import { useUserStore } from '../stores/userStore';
import DynamicPage from '../components/DynamicPage.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/upload',
    name: 'upload',
    component: FileUploader,
    meta: { requiresAuth: true },
  },
  {
    path: '/files',
    name: 'FileList',
    component: FileList,
    meta: { requiresAuth: true },
  },
  {
    path: '/preview/:fileId',
    name: 'FilePreview',
    component: FilePreview,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    component: Login,
  },
  {
    path: '/page/:title',
    name: 'DynamicPage',
    component: DynamicPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
