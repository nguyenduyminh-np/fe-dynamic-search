import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { TuiRoot } from '@taiga-ui/core';
import { Header } from '../../shared/layout/header/header';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, RouterOutlet, TuiRoot, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);

  // Signal hoá URL hiện tại
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  // ✅ Header ẩn ở 403/404/Login/Register
  readonly showHeader = computed(() => {
    const u = this.url();
    return !(
      u.startsWith('/login') ||
      u.startsWith('/register') ||
      u.startsWith('/forbidden') ||
      u.startsWith('/notfound')
    );
  });
}
