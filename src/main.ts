import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import './app/ag-grid.setup';
import { App } from './app/components/root/app';
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
