import { CommonModule } from '@angular/common';
import {
  Component,
  Injector,
  ViewEncapsulation,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

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
import { ParaPaymentCreatedDialog } from '../../components/payment-created-dialog/payment-created-dialog';
import { GeneralPaymentInput } from '../../components/group-input/general-payment-input/general-payment-input';
import { DetailPaymentInput } from '../../components/group-input/detail-payment-input/detail-payment-input';
import { JsonPaymentInput } from '../../components/group-input/json-payment-input/json-payment-input';

import { PaymentChannelCreateFacade } from '../../core/facades/payment-channel-create.facade';
import { jsonValidator } from '../../core/validators/json.validator';

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
    GeneralPaymentInput,
    DetailPaymentInput,
    JsonPaymentInput,
  ],
  templateUrl: './payment-channel-create.html',
  styleUrls: ['./payment-channel-create.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentChannelCreate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);
  private readonly alerts = inject(TuiAlertService);
  private readonly facade = inject(PaymentChannelCreateFacade);

  protected readonly isLoading = this.facade.isLoading;
  protected readonly errorMsg = this.facade.errorMsg;
  protected readonly connectionNameOptions = this.facade.connectionNameOptions;
  protected readonly currencyCodeOptions = this.facade.currencyCodeOptions;
  protected readonly msgStandardOptions = this.facade.msgStandardOptions;
  protected readonly channelStatusOptions = this.facade.channelStatusOptions;
  protected readonly paraStatusOptions = this.facade.paraStatusOptions;
  protected readonly webViewOptions = this.facade.webViewOptions;
  protected readonly activeStatusOptions = this.facade.activeStatusOptions;

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
      connectionName: this.fb.nonNullable.control<string>('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    }),

    detail: this.fb.nonNullable.group({
      channelStatus: this.fb.nonNullable.control<string>('', [
        Validators.required,
      ]),
      currencyCode: this.fb.nonNullable.control<string>('', [
        Validators.pattern(/^[A-Z]{3}$/),
      ]),
      msgStandard: this.fb.nonNullable.control<string>('', [
        Validators.required,
      ]),
      paraStatus: this.fb.control<number | null>(null, [Validators.required]),
      webView: this.fb.control<0 | 1 | null>(null, [Validators.required]),
      activeStatus: this.fb.control<0 | 1 | null>(null, [Validators.required]),
    }),

    json: this.fb.nonNullable.group({
      jsonDataText: this.fb.nonNullable.control('', [jsonValidator(30)]),
    }),
  });

  protected submit(): void {
    this.facade.clearError();

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const c = this.form.controls.general.controls.paymentChannel;
      if (c.invalid) {
        this.showErrorDialog(this.getErrorMessage(c));
      } else {
        this.showErrorDialog(
          'Dữ liệu không hợp lệ / Vui lòng nhập đầy đủ các trường !'
        );
      }
      return;
    }

    let jsonData: Record<string, unknown> = {};
    try {
      const jsonText =
        (this.form.controls.json.controls.jsonDataText.value ?? '').trim() ||
        '{}';
      jsonData = JSON.parse(jsonText);
    } catch {
      this.form.controls.json.controls.jsonDataText.setErrors({
        jsonInvalid: 'JSON parse error',
      });
      this.form.controls.json.controls.jsonDataText.markAsTouched();
      this.facade.setError('JSON Data không hợp lệ.');
      return;
    }

    const paraStatusCtrl = this.form.controls.detail.controls.paraStatus;
    const paraStatus = paraStatusCtrl.value;

    if (paraStatus === null) {
      paraStatusCtrl.setErrors({ required: true });
      paraStatusCtrl.markAsTouched();
      this.showErrorDialog('Vui lòng chọn Para Status');
      return;
    }

    const webViewCtrl = this.form.controls.detail.controls.webView;
    const webView = webViewCtrl.value;
    if (webView === null) {
      webViewCtrl.setErrors({ required: true });
      webViewCtrl.markAsTouched();
      this.showErrorDialog('Vui lòng chọn Web View');
      return;
    }

    const activeCtrl = this.form.controls.detail.controls.activeStatus;
    const activeStatus = activeCtrl.value;
    if (activeStatus === null) {
      activeCtrl.setErrors({ required: true });
      activeCtrl.markAsTouched();
      this.showErrorDialog('Vui lòng chọn Active Status');
      return;
    }

    const request: PaymentChannelCreateRequest = {
      paymentChannel: this.form.controls.general.controls.paymentChannel.value,
      connectionName: this.form.controls.general.controls.connectionName.value,

      channelStatus: this.form.controls.detail.controls.channelStatus.value,
      currencyCode: this.form.controls.detail.controls.currencyCode.value,
      msgStandard: this.form.controls.detail.controls.msgStandard.value,
      webView,
      paraStatus,
      activeStatus,

      jsonData,
    };

    this.facade.setLoading(true);

    this.paymentService
      .create(request)
      .pipe(finalize(() => this.facade.setLoading(false)))
      .subscribe({
        next: (res: any) => {
          if (res?.status === 201 && res?.data) {
            const created = res.data as PaymentChannel;
            this.openCreatedDialog(created);
            this.resetForm();
          } else {
            this.facade.setError(
              res?.message ?? 'Tạo mới thất bại (response không đúng format).'
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
    this.form.setValue({
      general: { paymentChannel: '', connectionName: '' },
      detail: {
        channelStatus: 'ACTIVE',
        currencyCode: 'VND',
        msgStandard: 'JSON',
        webView: null,
        paraStatus: null,
        activeStatus: null,
      },
      json: { jsonDataText: '' },
    });

    this.facade.clearError();
  }

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
        }
      )
      .subscribe();
  }

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

    if (e['required']) return 'Nhập đúng các trường bắt buộc';
    if (e['minlength'])
      return `Trường này yêu cầu tối thiểu ${e['minlength'].requiredLength} ký tự`;
    if (e['maxlength']) return `Tối đa ${e['maxlength'].requiredLength} ký tự`;
    if (e['min']) return `Giá trị tối thiểu là ${e['min'].min}`;
    if (e['max']) return `Giá trị tối đa là ${e['max'].max}`;
    if (e['pattern']) return 'Sai định dạng';
    if (e['jsonInvalid']) return 'JSON không hợp lệ';

    return 'Dữ liệu không hợp lệ';
  }
}
