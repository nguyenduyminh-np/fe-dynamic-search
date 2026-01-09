import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolesGuardTsGuard } from './roles.guard.ts-guard';

describe('rolesGuardTsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolesGuardTsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
