import { inject, Injectable, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { PaymentService } from '../services/payment-channel.service';
import {
  ActiveStatus,
  ChannelStatus,
  CurrencyCode,
  ParaStatusOption,
  WebViewOption,
} from '../../shared/util/payment-channel-create.util';

@Injectable()
export class PaymentChannelCreateFacade {
  private readonly paymentService = inject(PaymentService);

  // signal: reactive state: tự động update UI khi giá trị thay đổi
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly _connectionNameOptions = signal<readonly string[]>([]);

  private readonly _msgStandardOptions = signal<readonly string[]>([]);

  readonly isLoading = this._loading.asReadonly();
  readonly errorMsg = this._error.asReadonly();

  readonly connectionNameOptions = this._connectionNameOptions.asReadonly();
  readonly msgStandardOptions = this._msgStandardOptions.asReadonly();

  private readonly _webViewOptions = signal<readonly WebViewOption[]>([]);
  readonly webViewOptions = this._webViewOptions.asReadonly();

  private readonly _paraStatusOptions = signal<readonly ParaStatusOption[]>([]);
  readonly paraStatusOptions = this._paraStatusOptions.asReadonly();

  private readonly _currencyCodeOptions = signal<readonly CurrencyCode[]>([]);
  readonly currencyCodeOptions = this._currencyCodeOptions.asReadonly();

  private readonly _channelStatusOptions = signal<readonly ChannelStatus[]>([]);
  readonly channelStatusOptions = this._channelStatusOptions.asReadonly();

  private readonly _activeStatusOptions = signal<readonly ActiveStatus[]>([]);
  readonly activeStatusOptions = this._activeStatusOptions.asReadonly();

  init(): void {
    this._loading.set(true);
    this._error.set(null);

    // forkJoin: gọi nhiều API song song, return Observable
    forkJoin({
      connectionNames: this.paymentService.fetchConnectionNames(),
      currencyCodes: this.paymentService.fetchCurrencyCodes(),
      msgStandards: this.paymentService.fetchMessageStandards(),
      channelStatuses: this.paymentService.fetchChannelStatuses(),
      paraStatuses: this.paymentService.fetchParaStatuses(),
      webViews: this.paymentService.fetchWebView(),
      activeStatus: this.paymentService.fetchActiveStatus(),
    })
      // gắn sự kiện finalize ở đây, tắt loading
      .pipe(finalize(() => this._loading.set(false)))

      // kích hoạt observable chạy
      .subscribe({
        next: (r) => {
          // fast-fail
          this._connectionNameOptions.set(r.connectionNames ?? []);
          this._currencyCodeOptions.set(r.currencyCodes ?? []);
          this._msgStandardOptions.set(r.msgStandards ?? []);
          this._channelStatusOptions.set(r.channelStatuses ?? []);
          this._paraStatusOptions.set(r.paraStatuses ?? []);
          this._webViewOptions.set(r.webViews ?? []);
          this._activeStatusOptions.set(r.activeStatus ?? []);
        },
        error: () => {
          this._error.set('Không thể tải dữ liệu options.');
          this._connectionNameOptions.set([]);
          this._currencyCodeOptions.set([]);
          this._msgStandardOptions.set([]);
          this._channelStatusOptions.set([]);
          this._paraStatusOptions.set([]);
          this._webViewOptions.set([]);
          this._activeStatusOptions.set([]);
        },
      });
  }

  setLoading(value: boolean): void {
    this._loading.set(value);
  }

  setError(message: string | null): void {
    this._error.set(message);
  }

  clearError(): void {
    this._error.set(null);
  }
}
