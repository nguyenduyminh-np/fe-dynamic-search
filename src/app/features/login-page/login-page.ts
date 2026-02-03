import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiIcon,
  TuiLabel,
  TuiNotification,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiFieldErrorPipe,
  TuiPassword,
} from '@taiga-ui/kit';

import { AuthFacade } from '../../core/facades/auth.facade';
import { LoginRequest } from '../../core/models/auth.model';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    // Taiga UI
    TuiIcon,
    TuiPassword,
    TuiTextfield,
    TuiLabel,

    AsyncPipe,
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiHeader,
    TuiIcon,
    TuiNotification,
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
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);

  // đọc thông tin của route hiện tại
  private readonly route = inject(ActivatedRoute);
  private readonly alerts = inject(TuiAlertService);

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.nonNullable.group({
    username: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(6),
    ]),
    password: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
  });

  onSubmit(): void {
    // không disable, nhưng chặn double submit
    if (this.loading()) return;

    // mark để hiển thị lỗi nếu có (tuỳ UI bạn muốn)
    this.form.markAllAsTouched();

    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;

    // 1) Input null/empty => warn (giữ y như cũ)
    if (!username || !password) {
      this.alerts
        .open('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu', {
          appearance: 'warning',
          autoClose: 3000,
        })
        .subscribe();
      return;
    }

    // set loading true để hiện spinner
    this._loading.set(true);

    const payload: LoginRequest = { username, password };

    this.auth
      .login(payload)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: () => {
          // nếu user bị chặn khi vào trang vì chưa lohgin, raw sẽ đưa user về lại trang đó sau khi login
          const raw =
            this.route.snapshot.queryParamMap.get('returnUrl') ||
            '/payment-channels';

          // chặn returnUrl bẩn (vd: /payment-channels/notfound)
          const safe =
            raw.includes('notfound') || raw.startsWith('/login')
              ? '/payment-channels'
              : raw;

          this.router.navigateByUrl(safe);
        },
        // 2) Login fail => error
        error: () => {
          this.alerts
            .open('Đăng nhập thất bại. Vui lòng thử lại.', {
              appearance: 'error',
              autoClose: 4000,
            })
            .subscribe();
          this.onReset();
        },
      });
  }

  // 3) Nút reset: reset cả input + state form
  onReset(): void {
    this.form.reset({ username: '', password: '' }, { emitEvent: false }); // emit false: ko phát emit event như subcribe ,..
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
