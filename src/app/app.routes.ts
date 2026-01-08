import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'payment-channels', pathMatch: 'full' },

  {
    path: 'payment-channels',
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
        loadComponent: () =>
          import(
            './features/payment-channel-create/payment-channel-create.'
          ).then((m) => m.PaymentChannelCreate),
        title: 'Tạo mới kênh thanh toán',
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./features/payment-channel-edit/payment-channel-edit').then(
            (m) => m.PaymentChannelEdit
          ),
        title: 'Chỉnh sửa kênh thanh toán',
      },
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
    ],
  },
];
