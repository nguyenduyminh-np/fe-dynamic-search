import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { TuiButton, TuiDialogService, TuiIcon } from '@taiga-ui/core'; // Nhớ import TuiIcon

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  templateUrl: './error-dialog-component.html',
  // QUAN TRỌNG: Phải import TuiIcon để dùng được thẻ <tui-icon>
  imports: [TuiButton, TuiIcon],
})
export class ErrorDialogComponent {
  @ViewChild('errorDialogTemplate') errorTemplate!: TemplateRef<any>;

  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService
  ) {}

  showErrorDialog(errorMessage: string): void {
    this.dialogs
      .open(this.errorTemplate, {
        label: 'Đã xảy ra lỗi',
        size: 's',
        data: errorMessage,
        closeable: true,
        dismissible: true,
      })
      .subscribe();
  }
}
