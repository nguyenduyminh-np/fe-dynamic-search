import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStore } from '../auth/token.store';

export const authCanMatch: CanMatchFn = (_route, segments) => {
  const tokens = inject(TokenStore);
  const router = inject(Router);

  const attemptedUrl = '/' + segments.map((s) => s.path).join('/');
  const fallback =
    attemptedUrl && attemptedUrl !== '/' ? attemptedUrl : '/payment-channels';

  const access = tokens.accessToken();

  // Có access và chưa hết hạn => cho vào
  if (access && !tokens.isAccessExpired()) return true;

  // Không có refresh => fallback login + returnUrl
  // (Nếu access hết hạn nhưng có refresh, cho vào, interceptor sẽ tự refresh khi request API bị 401)
  if (!tokens.refreshToken()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: fallback },
    });
  }

  // Có refresh token => cho vào protected area
  // Refresh token rotation sẽ được interceptor xử lý khi request API bị 401
  return true;
};
