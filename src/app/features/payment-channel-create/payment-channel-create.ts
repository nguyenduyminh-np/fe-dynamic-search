import { CommonModule } from '@angular/common';
import {
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';

import {
  TuiAlertService,
  TuiButton,
  TuiDialogService,
  TuiLoader,
} from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';

import { PaymentService } from '../../core/services/payment-channel.service';
import {
  PaymentChannel,
  PaymentChannelCreateRequest,
} from '../../core/models/para-payment-channel.model';

import { PaymentChannelCreateFacade } from '../../core/facades/payment-channel-create.facade';

import { PaymentNameField } from '../../components/component-input-v1/payment-name-field/payment-name-field';
import { JsonPaymentInput } from '../../components/json-payment-input/json-payment-input';
import {
  getCachedJsonObject,
  jsonObjectValidator,
} from '../../shared/util/json.util';
import { ParaPaymentCreatedDialog } from '../../components/dialogs/payment-created-dialog/payment-created-dialog';
import { ConnectionNameSelect } from '../../components/component-input-v1/connection-name-select/connection-name-select';
import { CurrencyCodeSelect } from '../../components/component-input-v1/currency-code-select/currency-code-select';
import { MessageStandardSelect } from '../../components/component-input-v1/message-standard-select/message-standard-select';
import { ChannelStatusSelect } from '../../components/component-input-v1/channel-status-select/channel-status-select';
import { ParaStatusSelect } from '../../components/component-input-v1/para-status-select/para-status-select';
import { WebViewSelect } from '../../components/component-input-v1/web-view-select/web-view-select';
import { ActiveStatusSelect } from '../../components/component-input-v1/active-status-select/active-status-select';
import {
  ActiveStatusOption,
  ChannelStatusOption,
  CurrencyCodeOption,
  Option,
  ParaStatusOption,
  WebViewOption,
} from '../../core/models/common.model';

@Component({
  selector: 'app-para-payment-create',
  standalone: true,
  providers: [PaymentChannelCreateFacade],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TuiLoader,
    TuiButton,
    JsonPaymentInput,
    PaymentNameField,
    ConnectionNameSelect,
    CurrencyCodeSelect,
    MessageStandardSelect,
    ChannelStatusSelect,
    ParaStatusSelect,
    WebViewSelect,
    ActiveStatusSelect,
  ],
  templateUrl: './payment-channel-create.html',
  styleUrls: ['./payment-channel-create.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentChannelCreate implements OnInit {
  private readonly fb = inject(FormBuilder);

  private readonly facade = inject(PaymentChannelCreateFacade);
  private readonly paymentService = inject(PaymentService);

  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);
  private readonly alerts = inject(TuiAlertService);
  private readonly router = inject(Router);

  protected readonly isLoading = this.facade.isLoading;
  protected readonly errorMsg = this.facade.errorMsg;
  protected readonly connectionNameOptions = this.facade.connectionNameOptions;
  protected readonly currencyCodeOptions = this.facade.currencyCodeOptions;
  protected readonly msgStandardOptions = this.facade.msgStandardOptions;
  protected readonly channelStatusOptions = this.facade.channelStatusOptions;

  protected readonly paraStatusOptions = this.facade.paraStatusOptions;
  protected readonly webViewOptions = this.facade.webViewOptions;

  protected readonly activeStatusOptions = this.facade.activeStatusOptions;

  private readonly DEFAULT_FORM_VALUE = {
    general: {
      paymentChannel: '',
      connectionName: null as Option<string> | null,
    },
    detail: {
      channelStatus: null as ChannelStatusOption | null,
      currencyCode: null as CurrencyCodeOption | null,
      msgStandard: null as Option<string> | null,
      paraStatus: null as ParaStatusOption | null,
      webView: null as WebViewOption | null,
      activeStatus: null as ActiveStatusOption | null,
    },
    json: {
      jsonDataText: '{}',
    },
  };

  ngOnInit(): void {
    this.facade.init();
  }

  protected readonly form = this.fb.nonNullable.group({
    general: this.fb.nonNullable.group({
      paymentChannel: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]),
      connectionName: this.fb.nonNullable.control<Option<string> | null>(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    }),

    detail: this.fb.nonNullable.group({
      channelStatus: this.fb.nonNullable.control<ChannelStatusOption | null>(
        null,
        [Validators.required],
      ),

      currencyCode: this.fb.nonNullable.control<CurrencyCodeOption | null>(
        null,
        [Validators.required],
      ),

      msgStandard: this.fb.nonNullable.control<Option<string> | null>(null, [
        Validators.required,
      ]),

      paraStatus: this.fb.control<ParaStatusOption | null>(null, [
        Validators.required,
      ]),
      webView: this.fb.control<WebViewOption | null>(null, [
        Validators.required,
      ]),
      activeStatus: this.fb.control<ActiveStatusOption | null>(null, [
        Validators.required,
      ]),
    }),

    json: this.fb.nonNullable.group({
      jsonDataText: this.fb.nonNullable.control('{}', [
        jsonObjectValidator(100),
      ]),
    }),
  });

  protected submit(): void {
    this.facade.clearError();
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const paymentChannelCtrl =
        this.form.controls.general.controls.paymentChannel;
      if (paymentChannelCtrl.invalid) {
        this.showErrorDialog(this.getErrorMessage(paymentChannelCtrl));
      } else {
        this.showErrorDialog(
          'Dữ liệu không hợp lệ / Vui lòng nhập đầy đủ các trường !',
        );
      }
      return;
    }
    const jsonCtrl = this.form.controls.json.controls.jsonDataText;
    const jsonData = getCachedJsonObject(jsonCtrl);
    const channelStatusOpt =
      this.form.controls.detail.controls.channelStatus.value!;
    const currencyCodeOpt =
      this.form.controls.detail.controls.currencyCode.value!;
    const paraStatusOpt = this.form.controls.detail.controls.paraStatus.value!;
    const webViewOpt = this.form.controls.detail.controls.webView.value!;
    const activeStatus = this.form.controls.detail.controls.activeStatus.value!;

    const request: PaymentChannelCreateRequest = {
      paymentChannel: this.form.controls.general.controls.paymentChannel.value,
      connectionName:
        this.form.controls.general.controls.connectionName.value?.value,
      channelStatus: channelStatusOpt.value,
      currencyCode: currencyCodeOpt.value,
      msgStandard: this.form.controls.detail.controls.msgStandard.value?.value,
      webView: webViewOpt.value,
      paraStatus: paraStatusOpt.value,
      activeStatus: activeStatus.value,
      jsonData: jsonData,
    };

    console.log(request.paymentChannel);
    console.log(request.msgStandard);
    console.log(request.webView);
    console.log(request.jsonData);

    this.facade.setLoading(true);
    console.log(request);
    this.paymentService
      .create(request)
      .pipe(
        tap(() => {
          console.log('CREATE PAYMENT CHANNEL REQUEST:', request);
        }),
        finalize(() => this.facade.setLoading(false)),
      )
      .subscribe({
        next: (res: any) => {
          if (res?.status === 201 && res?.data) {
            const created = res.data as PaymentChannel;
            this.openCreatedDialog(created);
            this.resetForm();
            this.router.navigate(['/']);
          } else {
            this.facade.setError(
              res?.message ?? 'Tạo mới thất bại (response không đúng format).',
            );
          }
        },
        error: (err) => {
          const apiMsg = err?.error?.message ?? 'Lỗi gọi API create.';
          this.facade.setError(apiMsg);
          this.showErrorDialog('Tạo mới thất bại');
          console.error('CREATE ERROR:', err);
        },
      });
  }

  protected resetForm(): void {
    this.form.reset(this.DEFAULT_FORM_VALUE);
    this.facade.clearError();
  }

  // custom dialog
  private openCreatedDialog(created: PaymentChannel): void {
    this.dialogs
      .open(
        new PolymorpheusComponent(ParaPaymentCreatedDialog, this.injector),
        {
          data: created,
          label: 'TẠO MỚI THÀNH CÔNG',
          size: 'm',
          dismissible: false,
          closeable: true,
        },
      )
      .subscribe();
  }

  // alert
  private showErrorDialog(message: string): void {
    const msg =
      typeof this.errorMsg === 'function' ? this.errorMsg() : this.errorMsg;
    this.alerts
      .open(`${message}${msg ? `: ${msg}` : ''}`, {
        label: 'Đã xảy ra lỗi',
        autoClose: 3000,
        appearance: 'negative',
      })
      .subscribe();
  }

  getErrorMessage(ctrl: AbstractControl | null): string {
    const e = ctrl?.errors;
    if (!e) return '';
    if (e['jsonMustBeObject'])
      return 'JSON phải là object (dạng { ... }), không phải array/giá trị đơn';
    if (e['jsonTooManyKeys'])
      return `JSON vượt quá số key tối đa ${e['jsonTooManyKeys'].maxKeys}`;
    if (e['required']) return 'Nhập đúng các trường bắt buộc';
    if (e['minlength'])
      return `Trường này yêu cầu tối thiểu ${e['minlength'].requiredLength} ký tự`;
    if (e['maxlength']) return `Tối đa ${e['maxlength'].requiredLength} ký tự`;
    if (e['pattern']) return 'Sai định dạng';
    if (e['jsonInvalid']) return 'JSON không hợp lệ';
    if (e['jsonTooLong'])
      return `JSON vượt quá độ dài tối đa ${e['jsonTooLong'].maxLength}`;
    return 'Dữ liệu không hợp lệ';
  }
}
