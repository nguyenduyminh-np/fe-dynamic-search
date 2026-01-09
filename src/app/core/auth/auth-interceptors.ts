import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';

import { TokenStore } from './token.store';
import { AuthFacade } from '../facades/auth.facade';

let refreshInFlight$: ReturnType<AuthFacade['refresh']> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStore);
  const auth = inject(AuthFacade);
  const router = inject(Router);

  const isAuthEndpoint = req.url.includes('/api/v1/auth/');

  const access = tokens.accessToken();
  const reqWithAuth =
    !isAuthEndpoint && access
      ? req.clone({ setHeaders: { Authorization: `Bearer ${access}` } })
      : req;

  return next(reqWithAuth).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isAuthEndpoint || err.status !== 401) return throwError(() => err);

      if (!tokens.refreshToken()) {
        tokens.clear();
        router.navigateByUrl('/login');
        return throwError(() => err);
      }

      if (!refreshInFlight$) {
        refreshInFlight$ = auth.refresh().pipe(
          shareReplay(1),
          finalize(() => (refreshInFlight$ = null))
        );
      }

      return refreshInFlight$.pipe(
        switchMap(() => {
          const newAccess = tokens.accessToken();
          if (!newAccess) return throwError(() => err);

          return next(
            req.clone({ setHeaders: { Authorization: `Bearer ${newAccess}` } })
          );
        }),
        catchError((e) => {
          tokens.clear();
          router.navigateByUrl('/login');
          return throwError(() => e);
        })
      );
    })
  );
};
