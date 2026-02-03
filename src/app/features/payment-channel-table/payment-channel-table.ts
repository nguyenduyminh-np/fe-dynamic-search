// Angular Core
import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

// RxJS
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

// AG-GRID, TaigaUI
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridReadyEvent,
  GridApi,
  GridSizeChangedEvent,
  RowSelectionOptions,
  GetRowIdFunc,
  GetRowIdParams,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { TuiLoader } from '@taiga-ui/core';
import { TuiPagination } from '@taiga-ui/kit';

// Local Models & Components
import { PaymentChannelTableData } from '../../core/models/para-payment-channel.model';
import { PaymentChannelNativeSearchCriteria } from '../../core/models/common.model';
import { ActionCellRender } from '../../components/action-cell-render/action-cell-render';
import { DynamicSearchBar } from '../dynamic-search-bar/dynamic-search-bar';
import { PaymentChannelTableFacade } from '../../core/facades/payment-channel-table.facade';

@Component({
  selector: 'app-para-payment-table',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    TuiLoader,
    TuiPagination,
    RouterLink,
    DynamicSearchBar,
  ],

  // facade instance sống theo component khi được khởi tạo
  providers: [PaymentChannelTableFacade],
  templateUrl: './payment-channel-table.html',
  styleUrl: './payment-channel-table.css',
})
export class PaymentChannelTable {
  // ===========================
  // Inject
  // ===========================
  readonly facade = inject(PaymentChannelTableFacade);
  private readonly destroyRef = inject(DestroyRef);

  // ===========================
  // Alias state/computed for template
  // ===========================
  protected readonly rowData = this.facade.rowData;
  protected readonly selectedRows = this.facade.selectedRows;

  protected readonly isLoading = this.facade.isLoading;
  protected readonly isExporting = this.facade.isExporting;
  protected readonly isImporting = this.facade.isImporting;

  protected readonly currentPage = this.facade.currentPage;
  protected readonly totalPages = this.facade.totalPages;
  protected readonly totalElements = this.facade.totalElements;
  protected readonly pageSize = this.facade.pageSize;
  protected readonly pageSizeOptions = this.facade.pageSizeOptions;

  protected readonly hasSelection = this.facade.hasSelection;
  protected readonly isEmpty = this.facade.isEmpty;
  protected readonly totalRecordsLabel = this.facade.totalRecordsLabel;
  protected readonly canExport = this.facade.canExport;
  protected readonly canImport = this.facade.canImport;

  protected readonly canSubmit = this.facade.canSubmit;
  protected readonly canApprove = this.facade.canApprove;
  protected readonly canReject = this.facade.canReject;
  protected readonly canCancel = this.facade.canCancel;
  protected readonly isUpdatingStatus = this.facade.isUpdatingStatus;

  // ===========================
  // Grid fit (component-level)
  // ===========================
  private readonly FIT_BREAKPOINT = 1200;
  private readonly fitTrigger$ = new Subject<number>();
  private gridApi?: GridApi<PaymentChannelTableData>;
  private lastClientWidth = 0;

  // ===========================
  // Grid config
  // ===========================
  public readonly getRowId: GetRowIdFunc = (params: GetRowIdParams) =>
    String(params.data.id);

  public readonly rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    enableClickSelection: false,
    selectAll: 'currentPage',
    checkboxes: true,
    headerCheckbox: true,
  };

  public readonly defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    minWidth: 110,
  };

  public readonly selectionColumnDef: ColDef = {
    pinned: 'left',
    lockPinned: true,
    width: 50,
    minWidth: 50,
    maxWidth: 50,
    resizable: false,
    sortable: false,
    filter: false,
    suppressSizeToFit: true,
    cellClass: 'text-center',
  };

  protected readonly colDefs: ColDef<PaymentChannelTableData>[] = [
    { field: 'id', headerName: 'ID', hide: true },
    {
      field: 'paymentChannel',
      headerName: 'PAYMENT CHANNEL',
      pinned: 'left',
      lockPinned: true,
      width: 220,
      minWidth: 200,
      suppressSizeToFit: true,
      filter: true,
    },
    {
      field: 'paraStatus',
      headerName: 'Trạng thái tham số',
      lockPinned: true,
      pinned: 'left',
      suppressSizeToFit: true,
      filter: true,
      minWidth: 80,
    },
    {
      field: 'paraStatusCode',
      headerName: 'Mã trạng thái tham số',
      hide: true,
    },
    {
      field: 'channelStatus',
      headerName: 'CHANNEL STATUS',
      flex: 1,
      minWidth: 150,
    },
    { field: 'currencyName', headerName: 'CURRENCY', flex: 1, minWidth: 120 },
    {
      field: 'msgStandard',
      headerName: 'MSG STANDARD',
      flex: 1,
      minWidth: 140,
    },
    { field: 'webView', headerName: 'WEB VIEW', flex: 1, minWidth: 110 },
    {
      field: 'connectionName',
      headerName: 'CONNECTION NAME',
      minWidth: 130,
      suppressSizeToFit: true,
      filter: true,
    },
    {
      field: 'activeStatus',
      headerName: 'ACTIVE STATUS',
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: 'JSON DATA',
      field: 'jsonData',
      flex: 2,
      minWidth: 240,
      valueFormatter: (p) => (p.value ? JSON.stringify(p.value) : ''),
      tooltipValueGetter: (p) => (p.value ? JSON.stringify(p.value) : ''),
      cellClass: 'cell-ellipsis',
    },
    {
      headerName: 'ACTION',
      colId: 'action',
      pinned: 'right',
      lockPinned: true,
      width: 200,
      minWidth: 200,
      maxWidth: 220,
      suppressSizeToFit: true,
      resizable: false,
      sortable: false,
      filter: false,
      cellClass: 'cell-action',
      cellRenderer: ActionCellRender,
      cellRendererParams: {
        onDeleted: () => this.facade.reload(),
      },
    },
  ];

  constructor() {
    this.setupGridResizingPipeline();
    // Clear ag-grid selection khi facade emit
    this.facade.onClearSelection$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.gridApi?.deselectAll());
  }

  // ===========================
  // Template handlers -> Facade
  // ===========================

  onSubmit(): void {
    this.facade.approveParaStatus('SUBMIT');
  }
  onApprove(): void {
    this.facade.approveParaStatus('APPROVE');
  }
  onReject(): void {
    this.facade.approveParaStatus('REJECT');
  }
  onCancel(): void {
    this.facade.approveParaStatus('CANCEL');
  }

  onSearch(criteria: PaymentChannelNativeSearchCriteria): void {
    this.facade.search(criteria);
  }

  onResetSearch(): void {
    this.facade.resetSearch();
  }

  onPageChange(index: number): void {
    this.facade.changePage(index);
  }

  onPageSizeChange(size: number): void {
    this.facade.changePageSize(size);
  }

  onImportFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Gọi Facade import ngay khi người dùng chọn xong
      this.facade.importExcel(file);
    }

    // Reset value input để nếu user chọn lại file cũ vẫn kích hoạt sự kiện change
    input.value = '';
  }

  exportExcel() {
    this.facade.exportExcel();
  }

  exportTemplate() {
    this.facade.exportTemplate();
  }

  // ===========================
  // Grid events (component)
  // ===========================
  onGridReady(e: GridReadyEvent<PaymentChannelTableData>) {
    this.gridApi = e.api;
    this.requestFit(this.lastClientWidth);
  }

  onFirstDataRendered(_e: FirstDataRenderedEvent<PaymentChannelTableData>) {
    this.requestFit(this.lastClientWidth);
  }

  onGridSizeChanged(e: GridSizeChangedEvent<PaymentChannelTableData>) {
    this.lastClientWidth = e.clientWidth;
    this.requestFit(e.clientWidth);
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    const selected = event.api
      .getSelectedNodes()
      .map((n) => n.data)
      .filter(Boolean) as PaymentChannelTableData[];

    this.facade.setSelection(selected);
  }

  // ===========================
  // Fit columns pipeline (component)
  // ===========================
  private setupGridResizingPipeline() {
    this.fitTrigger$
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((w) => this.applyResponsiveSizing(w));
  }

  private requestFit(clientWidth: number) {
    if (!clientWidth) return;
    this.fitTrigger$.next(clientWidth);
  }

  private applyResponsiveSizing(clientWidth: number) {
    if (!this.gridApi) return;
    if (clientWidth >= this.FIT_BREAKPOINT) this.gridApi.sizeColumnsToFit();
  }
}
