import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper } from '@taiga-ui/kit';

@Component({
  standalone: true,
  selector: 'app-active-status-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiLabel,
    TuiChevron,
    TuiDataListWrapper,
  ],
  templateUrl: './active-status-select.html',
  styleUrl: './active-status-select.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class ActiveStatusSelect {
  @Input() options: readonly number[] = [];
}
