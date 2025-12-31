import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

export type DeleteConfirmData = {
  name: string;
};
@Component({
  standalone: true,
  selector: 'app-confirm-delete-dialog',
  imports: [CommonModule, TuiButton],
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.css',
})
export class ConfirmDeleteDialog {
  readonly ctx = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<
    boolean,
    DeleteConfirmData
  >;

  get data(): DeleteConfirmData {
    return this.ctx.data;
  }

  confirm(): void {
    this.ctx.completeWith(true);
  }

  cancel(): void {
    this.ctx.completeWith(false);
  }
}
