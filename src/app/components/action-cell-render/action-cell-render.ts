import { CommonModule } from '@angular/common';
import { Component, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { PaymentService } from '../../core/services/payment-channel.service';
import { PaymentChannel } from '../../core/models/para-payment-channel.model';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { ParaPaymentCreatedDialog } from '../payment-created-dialog/payment-created-dialog';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';

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
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly dialogs = inject(TuiDialogService);
  private readonly alert = inject(TuiAlertService);

  private params!: ActionParams;
  private paymentChannel!: string;
  private ID!: string;

  agInit(params: ActionParams): void {
    this.params = params;
    this.paymentChannel = params.data?.paymentChannel ?? '';
    this.ID = params.data?.id ?? '';
  }

  refresh(params: ActionParams): boolean {
    this.agInit(params);
    return true;
  }

  goDetail(): void {
    this.router.navigate(['/payment-channels', this.paymentChannel, 'detail']);
  }

  goEdit(): void {
    this.router.navigate(['/payment-channels', this.paymentChannel, 'edit']);
  }

  onDelete(): void {
    const id = this.ID;
    if (!id) {
      this.showAlert(null);
      return;
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
        }
      )
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.paymentService.delete({ id }).subscribe({
          next: () => this.params.onDeleted?.(),
          error: (err) => this.showAlert(err),
        });
      });
  }

  showAlert(err: unknown | null): void {
    const message =
      err instanceof HttpErrorResponse
        ? err.error?.message || err.message || 'Xoá thất bại. Vui lòng thử lại.'
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
