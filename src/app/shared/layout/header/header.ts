import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { TuiButton } from '@taiga-ui/core';
import { TuiAppBar } from '@taiga-ui/layout';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TuiAppBar, TuiButton],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly base = '/payment-channels';
}
