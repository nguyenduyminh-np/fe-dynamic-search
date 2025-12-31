// para-payment-table.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridReadyEvent,
  GridApi,
  ColumnState,
  GridSizeChangedEvent,
} from 'ag-grid-community';

import { TuiLoader } from '@taiga-ui/core';
import { TuiPagination } from '@taiga-ui/kit';

import { PaymentService } from '../../core/services/payment-channel.service';
import { PaymentChannel } from '../../core/models/para-payment-channel.model';
import { RouterLink } from '@angular/router';
import { ActionCellRender } from '../../components/action-cell-render/action-cell-render';

@Component({
  selector: 'app-para-payment-table',
  standalone: true,
  imports: [CommonModule, AgGridAngular, TuiLoader, TuiPagination, RouterLink],
  templateUrl: './payment-channel-table.html',
  styleUrl: './payment-channel-table.css',
})
export class PaymentChannelTable implements OnInit {
  private readonly paymentService = inject(PaymentService);

  protected readonly rowData = signal<PaymentChannel[]>([]);
  protected readonly isLoading = signal<boolean>(false);

  protected readonly currentPage = signal<number>(0);
  protected readonly totalPages = signal<number>(0);
  protected readonly totalElements = signal<number>(0);
  protected readonly pageSize = 10;

  private gridApi?: GridApi<PaymentChannel>;
  private fullState?: ColumnState[];
  private lastClientWidth = 0;

  protected readonly colDefs: ColDef<PaymentChannel>[] = [
    { field: 'id', headerName: 'ID', width: 80, hide: true },

    {
      field: 'paymentChannel',
      headerName: 'PAYMENT CHANNEL',
      flex: 2,
      minWidth: 150,
      filter: true,
    },

    { field: 'connectionName', headerName: 'CONNECTION NAME', width: 150 },

    {
      field: 'channelStatus',
      headerName: 'CHANNEL STATUS',
      minWidth: 100,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color =
          status === 'ACTIVE'
            ? 'var(--tui-status-positive)'
            : status === 'CLOSED'
            ? 'var(--tui-status-negative)'
            : 'var(--tui-status-warning)';

        return `<span style="color: ${color}; font-weight: bold">${status}</span>`;
      },
    },

    { field: 'currencyCode', headerName: 'CURRENCY CODE', width: 120 },

    { field: 'msgStandard', headerName: 'MESSAGE STANDARD', width: 150 },

    { field: 'activeStatus', headerName: 'ACTIVE STATUS', width: 130 },

    {
      headerName: 'JSON DATA',
      field: 'jsonData',
      flex: 1,
      suppressAutoSize: true,
      valueFormatter: (p) => (p.value ? JSON.stringify(p.value) : ''),
      tooltipValueGetter: (p) => (p.value ? JSON.stringify(p.value) : ''),
      cellClass: 'cell-ellipsis',
    },
    {
      headerName: 'ACTION',
      minWidth: 180,
      cellRenderer: ActionCellRender,
      resizable: true,
      sortable: false,
      filter: false,
      cellRendererParams: {
        onDeleted: () => this.loadData(this.currentPage()),
      },
    },
  ];

  protected readonly defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  ngOnInit(): void {
    this.loadData(0);
  }

  onGridReady(e: GridReadyEvent<PaymentChannel>) {
    this.gridApi = e.api;
  }

  onFirstDataRendered(e: FirstDataRenderedEvent<PaymentChannel>) {
    const ids: string[] = [];
    e.api.getColumns()?.forEach((col) => {
      const id = col.getId();
      if (id !== 'jsonData') ids.push(id);
    });
    e.api.autoSizeColumns(ids);

    if (this.lastClientWidth && this.lastClientWidth < 900) {
      e.api.sizeColumnsToFit();
    } else {
      this.fullState = e.api.getColumnState();
    }
  }

  onGridSizeChanged(e: GridSizeChangedEvent<PaymentChannel>) {
    this.lastClientWidth = e.clientWidth;

    if (e.clientWidth < 900) {
      e.api.sizeColumnsToFit();
    } else {
      if (this.fullState?.length) {
        e.api.applyColumnState({ state: this.fullState, applyOrder: true });
      } else {
        this.fullState = e.api.getColumnState();
      }
    }
  }

  onPageChange(index: number): void {
    this.currentPage.set(index);
    this.loadData(index);
  }

  private loadData(pageIndex: number): void {
    this.isLoading.set(true);

    const request = {
      pageNo: pageIndex,
      pageSize: this.pageSize,
    };

    this.paymentService
      .fetchAll(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res.status === 200 && res.data) {
            this.rowData.set(res.data.items);
            this.totalPages.set(res.data.totalPage);
            this.totalElements.set(res.data.totalElements);
          }
        },
        error: (err) => {
          console.error('Lỗi tải dữ liệu:', err);
        },
      });
  }
}
