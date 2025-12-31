import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiSwitch } from '@taiga-ui/kit';

@Component({
  standalone: true,
  selector: 'app-mini-card-settings',
  imports: [CommonModule, ReactiveFormsModule, TuiSwitch],
  templateUrl: './mini-card-switch.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }],
})
export class MiniCardSwitch {}
