import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TuiAlertService, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { finalize } from 'rxjs';

import { AuthFacade } from '../../core/facades/auth.facade';
import { LoginRequest } from '../../core/models/auth.model';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TuiIcon,
    TuiPassword,
    TuiTextfield,
    NgIf,
    CommonModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly alerts = inject(TuiAlertService);

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  model: LoginRequest = { username: '', password: '' };

  onSubmit(form: NgForm): void {
    if (this.loading()) return;

    this._loading.set(true);

    this.auth
      .login(this.model)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: () => {
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
        error: (err) => {
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            err?.message ||
            'Đăng nhập thất bại. Vui lòng thử lại.';

          this.alerts
            .open(msg, { appearance: 'error', autoClose: 4000 })
            .subscribe();

          this.model = { username: '', password: '' };
          form.resetForm(this.model);
        },
      });
  }
}
