import { inject, Injectable, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { PaymentService } from '../services/payment-channel.service';

@Injectable()
export class PaymentChannelCreateFacade {
  private readonly paymentService = inject(PaymentService);

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly _connectionNameOptions = signal<readonly string[]>([]);
  private readonly _currencyCodeOptions = signal<readonly string[]>([]);
  private readonly _msgStandardOptions = signal<readonly string[]>([]);
  private readonly _channelStatusOptions = signal<readonly string[]>([]);
  private readonly _paraStatusOptions = signal<readonly number[]>([]);
  private readonly _webViewOptions = signal<readonly number[]>([]);
  private readonly _activeStatusOptions = signal<readonly number[]>([]);

  readonly isLoading = this._loading.asReadonly();
  readonly errorMsg = this._error.asReadonly();

  readonly connectionNameOptions = this._connectionNameOptions.asReadonly();
  readonly currencyCodeOptions = this._currencyCodeOptions.asReadonly();
  readonly msgStandardOptions = this._msgStandardOptions.asReadonly();
  readonly channelStatusOptions = this._channelStatusOptions.asReadonly();
  readonly paraStatusOptions = this._paraStatusOptions.asReadonly();
  readonly webViewOptions = this._webViewOptions.asReadonly();
  readonly activeStatusOptions = this._activeStatusOptions.asReadonly();

  init(): void {
    this._loading.set(true);
    this._error.set(null);

    forkJoin({
      connectionNames: this.paymentService.fetchConnectionNames(),
      currencyCodes: this.paymentService.fetchCurrencyCodes(),
      msgStandards: this.paymentService.fetchMessageStandards(),
      channelStatuses: this.paymentService.fetchChannelStatuses(),
      paraStatuses: this.paymentService.fetchParaStatuses(),
      webViews: this.paymentService.fetchWebView(),
      activeStatus: this.paymentService.fetchActiveStatus(),
    })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (r) => {
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
