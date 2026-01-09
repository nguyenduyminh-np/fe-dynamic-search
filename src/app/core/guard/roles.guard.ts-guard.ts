import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStore } from '../auth/token.store';

export const rolesCanMatch =
  (allowed: string[]): CanMatchFn =>
  (_route, segments) => {
    const tokens = inject(TokenStore);
    const router = inject(Router);

    const attemptedUrl = '/' + segments.map((s) => s.path).join('/');
    const fallback =
      attemptedUrl && attemptedUrl !== '/' ? attemptedUrl : '/payment-channels';

    const role = tokens.role();
    if (!role) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: fallback },
      });
    }

    return allowed.includes(role) ? true : router.parseUrl('/forbidden');
  };
