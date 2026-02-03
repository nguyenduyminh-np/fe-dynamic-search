import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  TuiButton,
  type TuiDialogContext,
  TuiNotification,
} from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

export interface GuardBlockModel {
  title: string;
  content: string;
  returnUrl?: string;
}

@Component({
  standalone: true,
  selector: 'app-guard-block-dialog',
  imports: [TuiButton, TuiNotification],
  templateUrl: './guard-block-dialog.html',
  styleUrls: ['./guard-block-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuardBlockDialog {
  private readonly context =
    injectContext<TuiDialogContext<void, GuardBlockModel>>();
  private readonly router = inject(Router);

  protected get data(): GuardBlockModel {
    return this.context.data;
  }

  close(): void {
    this.context.completeWith();
  }

  goLogin(): void {
    const returnUrl = this.data.returnUrl || '/payment-channels';
    this.context.completeWith();
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
  }
}
