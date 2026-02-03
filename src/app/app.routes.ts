import { Routes } from '@angular/router';
import { authCanMatch } from './core/guard/auth.guard.ts-guard';
import { rolesCanMatch } from './core/guard/roles.guard.ts-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/default-page/default-page').then((m) => m.DefaultPage),
    title: 'Default',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login-page/login-page').then((m) => m.LoginPage),
    title: 'Đăng nhập',
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/register-page/register-page').then(
        (m) => m.RegisterPage
      ),
    title: 'Đăng ký',
  },

  // Protected area
  {
    path: 'payment-channels',
    canMatch: [authCanMatch],
    loadComponent: () =>
      import(
        './shared/layout/payment-channels-layout/payment-channels-layout'
      ).then((m) => m.PaymentChannelsLayout),

    // children component
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/payment-channel-table/payment-channel-table').then(
            (m) => m.PaymentChannelTable
          ),
        title: 'Danh sách kênh thanh toán',
      },
      {
        path: 'create',
        canMatch: [rolesCanMatch(['ADMIN'])],
        loadComponent: () =>
          import(
            './features/payment-channel-create/payment-channel-create'
          ).then((m) => m.PaymentChannelCreate),
        title: 'Tạo mới kênh thanh toán',
      },
      {
        path: 'edit',
        canMatch: [rolesCanMatch(['ADMIN'])],
        loadComponent: () =>
          import('./features/payment-channel-edit/payment-channel-edit').then(
            (m) => m.PaymentChannelEdit
          ),
        title: 'Chỉnh sửa kênh thanh toán',
      },
    ],
  },

  // fallback page
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/unauthorized-page/unauthorized-page').then(
        (m) => m.UnauthorizedPage
      ),
    title: 'Không có quyền truy cập',
  },
  {
    path: 'notfound',
    loadComponent: () =>
      import(
        './features/resources-not-found-page/resources-not-found-page'
      ).then((m) => m.ResourcesNotFoundPage),
    title: 'Không tìm thấy',
  },

  // Fallback
  { path: '**', redirectTo: 'notfound' },
];
