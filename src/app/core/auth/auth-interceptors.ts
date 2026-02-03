import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  finalize,
  shareReplay,
  switchMap,
  throwError,
  tap,
} from 'rxjs';

import { TokenStore } from './token.store';
import { AuthFacade } from '../facades/auth.facade';
import { TuiAlertService } from '@taiga-ui/core';

let refreshInFlight$: ReturnType<AuthFacade['refresh']> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStore);
  const auth = inject(AuthFacade);
  const router = inject(Router);
  const alert = inject(TuiAlertService);

  const isAuthEndpoint = req.url.includes('/api/v1/auth/');

  const access = tokens.accessToken();
  const reqWithAuth =
    !isAuthEndpoint && access
      ? req.clone({ setHeaders: { Authorization: `Bearer ${access}` } })
      : req;

  return next(reqWithAuth).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isAuthEndpoint || err.status !== 401) {
        console.log('interceptors bắt lỗi ở đây');
        return throwError(() => err);
      }

      if (!tokens.refreshToken()) {
        tokens.clear();
        router.navigateByUrl('/login');

        console.log('interceptors bắt lỗi ở đây');
        return throwError(() => err);
      }

      if (!refreshInFlight$) {
        // call refresh, xin token mới
        // đồng thời gửi token cũ lên server để destroy và lưu token mới (check mỗi lần refresh)
        refreshInFlight$ = auth.refresh().pipe(
          tap(() => {
            alert
              .open('Phiên đăng nhập đã được gia hạn tự động', {
                label: 'Đăng nhập lại thành công',
                appearance: 'positive',
                autoClose: 3000,
              })
              .subscribe();
          }),
          shareReplay(1),
          finalize(() => (refreshInFlight$ = null))
        );
      }

      return refreshInFlight$.pipe(
        switchMap(() => {
          const newAccess = tokens.accessToken();
          if (!newAccess) {
            return throwError(() => err);
          }

          return next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${newAccess}` },
            })
          );
        }),
        catchError((e) => {
          alert
            .open('Lỗi khi cố gắng tự động đăng nhập lại', {
              label: 'Đã xảy ra lỗi',
              appearance: 'negative',
              autoClose: 4000,
              closeable: true,
            })
            .subscribe();
          tokens.clear();
          router.navigateByUrl('/login');
          return throwError(() => e);
        })
      );
    })
  );
};
