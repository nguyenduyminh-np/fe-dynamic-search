import { Component, inject } from '@angular/core';
import {
  TuiButton,
  TuiDialogService,
  TuiRoot,
  TuiSurface,
} from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { ConfirmDeleteDialog } from '../../components/dialogs/confirm-delete-dialog/confirm-delete-dialog';
import { GuardBlockDialog } from '../../components/dialogs/guard-block-dialog/guard-block-dialog';
import { ParaPaymentCreatedDialog } from '../../components/dialogs/payment-created-dialog/payment-created-dialog';
import { PaymentDetailDialog } from '../../components/dialogs/payment-detail-dialog/payment-detail-dialog';

@Component({
  selector: 'app-default-page',
  standalone: true,
  imports: [TuiRoot, TuiSurface, TuiButton],
  templateUrl: './default-page.html',
  styleUrl: './default-page.css',
})
export class DefaultPage {
  private readonly dialogs = inject(TuiDialogService);

  openConfirmDelete(): void {
    this.dialogs
      .open<boolean>(new PolymorpheusComponent(ConfirmDeleteDialog), {
        label: 'Xác nhận xóa',
        data: { name: 'Kênh thanh toán ACB-01' },
      })
      .subscribe((ok) => console.log('[ConfirmDeleteDialog] result:', ok));
  }

  openGuardBlock(): void {
    this.dialogs
      .open<void>(new PolymorpheusComponent(GuardBlockDialog), {
        label: 'Thông báo',
        data: {
          title: 'Bạn cần đăng nhập',
          content:
            'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.',
          returnUrl: '/payment-channels',
        },
      })
      .subscribe(() => console.log('[GuardBlockDialog] closed'));
  }

  openPaymentCreated(): void {
    this.dialogs
      .open<void>(new PolymorpheusComponent(ParaPaymentCreatedDialog), {
        label: 'Tạo kênh thành công',
        data: {
          id: 1001,
          paymentChannel: 'VNPAY-QR',
          channelStatus: 1,
          currencyCode: 'VND',
          msgStandard: 'ISO20022',
          activeStatus: 1,
        } as any, // chỉ để test dialog (đỡ cần đủ type model)
      })
      .subscribe(() => console.log('[ParaPaymentCreatedDialog] closed'));
  }

  openPaymentDetail(): void {
    this.dialogs
      .open<null>(new PolymorpheusComponent(PaymentDetailDialog), {
        label: 'Chi tiết kênh thanh toán',
        data: 1, // id giả để test (dialog sẽ gọi API theo id này)
      })
      .subscribe((v) => console.log('[PaymentDetailDialog] result:', v));
  }
}
