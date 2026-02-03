import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiTextfieldComponent,
  TuiLabel,
  TuiTextfieldDirective,
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiIcon,
  TuiNotification,
  TuiTextfield,
  TuiTitle,
  TuiAlertService,
} from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipe,
  TuiPassword,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { AuthFacade } from '../../core/facades/auth.facade';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AuthResponse,
  AuthTokensResponse,
  RegisterRequest,
} from '../../core/models/auth.model';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    TuiTextfieldComponent,
    TuiLabel,
    TuiTextfieldDirective,
    AsyncPipe,
    ReactiveFormsModule,
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiHeader,
    TuiIcon,
    TuiNotification,
    TuiTextfield,
    TuiTitle,
    TuiPassword,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Xin mời nhập thông tin cho trường này',
        minlength: ({ requiredLength }: any) =>
          `Tối thiểu ${requiredLength} ký tự`,
        maxlength: ({ requiredLength }: any) =>
          `Tối đa ${requiredLength} ký tự`,
      },
    },
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);

  private readonly current_route = inject(ActivatedRoute);
  private readonly alerts = inject(TuiAlertService);

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    username: this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(6),
    ]),
    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(6),
    ]),
  });

  onSubmit() {
    if (this.loading()) return;

    // hiển thị loooix UI
    this.form.markAllAsTouched();

    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;

    if (!username || !password) {
      this.alerts
        .open('Vui lòng nhập đầy đủ thông tin đăng ký', {
          appearance: 'warning',
          autoClose: 3000,
        })
        .subscribe();
      return;
    }

    this._loading.set(true);
    const payload: RegisterRequest = { username, password };
    this.auth
      .register(payload)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res: AuthResponse) => {
          const raw =
            this.current_route.snapshot.queryParamMap.get('returnUrl') ||
            '/payment-channels';

          const safe =
            raw.includes('notfound') || raw.startsWith('/login')
              ? '/payment-channels'
              : raw;
          this.router.navigateByUrl(safe);
          if (res.message === 'REGISTER_SUCCESSFULLY') {
            const successMsg = 'Đăng ký thành công';
            this.showAlertSuccess(successMsg);
            return;
          }
        },
        error: (err) => {
          this.showAlertError(err);
        },
      });
  }

  private showAlertSuccess(message: string): void {
    this.alerts
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

    this.alerts
      .open(message, {
        label: 'Đã xảy ra lỗi',
        appearance: 'negative',
        autoClose: 4000,
        closeable: true,
      })
      .subscribe();
  }

  onReset(): void {
    this.form.reset({ username: '', password: '' }, { emitEvent: false });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
