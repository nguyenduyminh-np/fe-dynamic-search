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
    ],
  },
];
