import { CommonModule } from '@angular/common';
import { Component, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { PaymentService } from '../../core/services/payment-channel.service';
import {
  PaymentChannel,
  PaymentChannelDeleteResponse,
  PaymentChannelDetailRequest,
} from '../../core/models/para-payment-channel.model';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDeleteDialog } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog';
import { PaymentDetailDialog } from '../dialogs/payment-detail-dialog/payment-detail-dialog';

type ActionParams = ICellRendererParams<PaymentChannel> & {
  onDeleted?: () => void;
};

@Component({
  standalone: true,
  selector: 'app-action-cell-render',
  imports: [CommonModule],
  templateUrl: './action-cell-render.html',
  styleUrl: './action-cell-render.css',
})
export class ActionCellRender implements ICellRendererAngularComp {
  private readonly paymentService = inject(PaymentService);
  private readonly injector = inject(Injector);
  private readonly dialogs = inject(TuiDialogService);
  private readonly alert = inject(TuiAlertService);

  private params!: ActionParams;
  // name
  private paymentChannel!: string;

  // ID
  private ID?: number;

  agInit(params: ActionParams): void {
    this.params = params;
    this.paymentChannel = params.data?.paymentChannel ?? '';
    this.ID = params.data?.id ?? 0;
  }

  refresh(params: ActionParams): boolean {
    this.agInit(params);
    return true;
  }

  protected showDetailDialog(): void {
    console.log('GET DETAIL with ID: ' + this.ID);
    var pc = this.paymentService.getDetail({
      id: this.ID,
    } as PaymentChannelDetailRequest);
    console.log(pc);
    this.dialogs
      .open(new PolymorpheusComponent(PaymentDetailDialog, this.injector), {
        data: this.ID,
        label: 'THÔNG TIN CHI TIẾT',
        size: 'l',
        dismissible: true,
        closeable: true,
      })
      .subscribe();
  }

  goEdit() {
    throw new Error('Method not implemented.');
  }

  onDelete(): boolean {
    const id = this.ID;
    if (!id) {
      this.showAlertError({ message: 'Không tìm thấy ID để xoá.' });
      return false;
    }

    this.dialogs
      .open<boolean>(
        new PolymorpheusComponent(ConfirmDeleteDialog, this.injector),
        {
          data: { name: this.paymentChannel },
          label: 'Xác nhận xoá',
          size: 'm',
          dismissible: true,
          closeable: true,
        },
      )
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.paymentService.delete({ id }).subscribe({
          next: (res: PaymentChannelDeleteResponse) => {
            // status = 200: delete
            if (res?.status === 200) {
              // refresh table
              this.params.onDeleted?.();

              // show success message from API
              const successMsg = res.data || res.message || 'Xoá thành công.';
              this.showAlertSuccess(successMsg);
              return;
            }
          },
          error: (err) => this.showAlertError(err),
        });
      });

    return true;
  }

  private showAlertSuccess(message: string): void {
    this.alert
      .open(message, {
        label: 'Thành công',
        appearance: 'positive',
        autoClose: 3000,
        closeable: true,
      })
      .subscribe();
  }

  private showAlertError(err: unknown | { message?: string } | null): void {
    const message =
      err instanceof HttpErrorResponse
        ? // Backend error chuẩn: ApiErrorResponse.message
          (typeof err.error === 'string' ? err.error : err.error?.message) ||
          err.message ||
          'Xoá thất bại. Vui lòng thử lại.'
        : typeof (err as any)?.message === 'string'
          ? (err as any).message
          : 'Xoá thất bại. Vui lòng thử lại.';

    this.alert
      .open(message, {
        label: 'Đã xảy ra lỗi',
        appearance: 'negative',
        autoClose: 4000,
        closeable: true,
      })
      .subscribe();
  }
}
