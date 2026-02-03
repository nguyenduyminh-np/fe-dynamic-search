import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { NgIf } from '@angular/common';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { TuiAppBar } from '@taiga-ui/layout';
import { TokenStore } from '../../../core/auth/token.store';
import { AuthFacade } from '../../../core/facades/auth.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, TuiAppBar, TuiButton],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly base = '/payment-channels';

  private readonly router = inject(Router);
  private readonly authService = inject(AuthFacade);
  private readonly tokenStore = inject(TokenStore);
  private readonly alert = inject(TuiAlertService);

  readonly isLoggedIn = computed(() => this.tokenStore.hasRefresh());

  logout(): void {
    if (!this.tokenStore.hasRefresh()) {
      this.alert.open('Lỗi khi đăng xuất / User hiện tại không trong session', {
        appearance: 'error',
        autoClose: 4000,
      });
      this.router.navigate(['/login']);
      return;
    }

    const refreshToken = this.tokenStore.refreshToken();
    if (!refreshToken) {
      this.tokenStore.clear();
      this.router.navigate(['/login']);
      return;
    }

    this.authService.logout().subscribe({
      next: () => {
        this.tokenStore.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.tokenStore.clear();
        this.router.navigate(['/login']);
      },
    });
  }
}


// 