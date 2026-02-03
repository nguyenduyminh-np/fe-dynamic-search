import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { inject, INJECTOR } from '@angular/core';
import { take } from 'rxjs/operators';

import { TokenStore } from '../auth/token.store';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import {
  GuardBlockDialog,
  GuardBlockModel,
} from '../../components/dialogs/guard-block-dialog/guard-block-dialog';

// chống spam: chỉ cho phép 1 dialog tại 1 thời điểm
let authDialogOpen = false;

export const authCanMatch: CanMatchFn = (
  _route: Route,
  segments: UrlSegment[]
): boolean => {
  const tokens = inject(TokenStore);
  const router = inject(Router);

  // 1) Có access và chưa hết hạn => cho vào
  const access = tokens.accessToken();
  if (access && !tokens.isAccessExpired()) return true;

  // 2) Có refresh => cho vào (interceptor sẽ refresh khi API 401)
  if (tokens.refreshToken()) return true;

  // 3) Chưa login => mở dialog => user bấm login => navigate sang /login?returnUrl=...
  if (authDialogOpen) return false;
  authDialogOpen = true;

  const dialogs = inject(TuiDialogService);
  const injector = inject(INJECTOR);

  // lấy ra url user đang cố truy cập nhưng bị guard chặn
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
    .subscribe({
      complete: () => {
        authDialogOpen = false;
      },
    });

  return false;
};
