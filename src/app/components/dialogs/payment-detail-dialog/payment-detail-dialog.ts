import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { PaymentService } from '../../../core/services/payment-channel.service';
import {
  PaymentChannel,
  PaymentChannelDetailRequest,
  PaymentChannelDetailResponse,
} from '../../../core/models/para-payment-channel.model';
import { catchError, map, of, shareReplay } from 'rxjs';
import {
  displayMappedValue,
  getPillVariant,
  PaymentChannelMapKey,
  pillClass,
} from '../../../shared/util/value-label-mapping.util';

@Component({
  standalone: true,
  selector: 'app-payment-detail-dialog',
  imports: [AsyncPipe, CommonModule, TuiButton],
  templateUrl: './payment-detail-dialog.html',
  styleUrl: './payment-detail-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailDialog {
  private readonly context = injectContext<TuiDialogContext<null, number>>();
  private readonly api = inject(PaymentService);
  private readonly id = this.context.data;

  readonly detail$ = this.api
    .getDetail({ id: this.id } as PaymentChannelDetailRequest)
    .pipe(
      map(
        (res: PaymentChannelDetailResponse) =>
          (res as any)?.data ?? (res as any)
      ),
      map((data: unknown) => data as PaymentChannel),
      catchError((err) => {
        console.error('LỖI KHI CALL API getDetail', err);
        return of(null as unknown as PaymentChannel);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  close(): void {
    this.context.completeWith(null);
  }

  displayValue(field: PaymentChannelMapKey, raw: unknown): string {
    return displayMappedValue(field, raw);
  }

  /** ✅ dùng cho mọi field map */
  pillFor(field: PaymentChannelMapKey, raw: unknown): string {
    return pillClass(getPillVariant(field, raw));
  }
}
