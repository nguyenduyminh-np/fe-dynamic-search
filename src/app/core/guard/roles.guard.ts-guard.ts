import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject, INJECTOR } from '@angular/core';
import { take } from 'rxjs/operators';

import { TokenStore } from '../auth/token.store';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import {
  GuardBlockDialog,
  GuardBlockModel,
} from '../../components/dialogs/guard-block-dialog/guard-block-dialog';

let sessionDialogOpen = false;

export const rolesCanMatch =
  (allowed: string[]): CanMatchFn =>
  (_route, segments): boolean | UrlTree => {
    const tokens = inject(TokenStore);
    const router = inject(Router);

    // Case 2: đã login (có refresh)
    if (tokens.refreshToken()) {
      const role = tokens.role();

      //  role chưa có (session legacy / chưa hydrate) => cho qua để tránh forbidden sai
      // (sau đó interceptor sẽ tự call refresh làm mới access & profile)
      if (!role) return true;

      return allowed.includes(role) ? true : router.parseUrl('/forbidden');
    }

    // Case 1: chưa login => mở dialog => dialog tự navigate sang login?returnUrl=...
    if (sessionDialogOpen) return false;
    sessionDialogOpen = true;

    const injector = inject(INJECTOR);
    const dialogs = inject(TuiDialogService);

    const nav = router.currentNavigation();
    const navUrl = nav?.extractedUrl?.toString() ?? null;

    const attemptedUrl =
      navUrl && navUrl !== '/'
        ? navUrl
        : '/' + segments.map((s) => s.path).join('/');

    const returnUrl =
      attemptedUrl && attemptedUrl !== '/' ? attemptedUrl : '/payment-channels';

    dialogs
      .open<void>(new PolymorpheusComponent(GuardBlockDialog, injector), {
        data: <GuardBlockModel>{
          title: 'Bạn chưa đăng nhập',
          content: 'Vui lòng đăng nhập để tiếp tục',
          returnUrl,
        },
        closeable: true,
        dismissible: true,
        size: 'm',
      })
      .pipe(take(1))
      .subscribe({ complete: () => (sessionDialogOpen = false) });

    return false;
  };
