import {
  DestroyRef,
  Injectable,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Subject,
  of,
  switchMap,
  finalize,
  catchError,
  tap,
  debounceTime,
} from 'rxjs';

import { PaymentService } from '../../core/services/payment-channel.service';
import { PaymentChannelTableData } from '../../core/models/para-payment-channel.model';
import {
  PaymentChannelNativeSearchCriteria,
  PaymentChannelNativeSearchRequest,
} from '../../core/models/common.model';

import { sanitizeNativeSearchRequest } from '../../shared/util/sanitize-input.util';
import {
  downloadBlob,
  getFilenameFromContentDisposition,
} from '../../shared/util/excel.util';
import { TuiAlertService } from '@taiga-ui/core';
import {
  ACTION_REQUIRED_STATUS,
  ApprovalAction,
  PARA_STATUS,
  PARA_STATUS_LABELS,
} from '../models/approve.model';

@Injectable()
export class PaymentChannelTableFacade {
  private readonly paymentService = inject(PaymentService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);

  // ========== STATE ==========
  readonly rowData = signal<PaymentChannelTableData[]>([]);
  readonly selectedRows = signal<PaymentChannelTableData[]>([]);

  readonly isLoading = signal(false);
  readonly isExporting = signal(false);
  readonly isImporting = signal(false);

  // approve business
  readonly isUpdatingStatus = signal(false);

  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize = signal(10);
  readonly pageSizeOptions = [10, 20, 50, 100] as const;

  readonly criteria = signal<PaymentChannelNativeSearchCriteria>({});

  // ========== COMPUTED ==========
  readonly hasSelection = computed(() => this.selectedRows().length > 0);

  readonly isEmpty = computed(
    () => !this.isLoading() && this.rowData().length === 0,
  );

  readonly totalRecordsLabel = computed(() => `${this.totalElements()}`);

  readonly canExport = computed(() => !this.isLoading() && !this.isExporting());

  // Chỉ disable import khi đang loading hoặc đang import
  readonly canImport = computed(() => !this.isLoading() && !this.isImporting());

  // approve business
  readonly selectedStatus = computed(() => {
    const rows = this.selectedRows();
    if (rows.length === 0) return null;

    const firstStatus = rows[0].paraStatusCode;
    const allSame = rows.every((r) => r.paraStatusCode === firstStatus);
    return allSame ? firstStatus : null;
  });

  // Detect khi user chọn các row có para_status khác nhau
  // signal theo dõi row được select, check xem có trùng para_status
  readonly hasMixedStatus = computed(() => {
    const rows = this.selectedRows();
    if (rows.length <= 1) return false;

    const firstStatus = rows[0].paraStatusCode;
    return !rows.every((r) => r.paraStatusCode === firstStatus);
  });

  readonly canSubmit = computed(
    () => this.selectedStatus() === PARA_STATUS.NEW,
  );
  readonly canApprove = computed(
    () => this.selectedStatus() === PARA_STATUS.PENDING,
  );
  readonly canReject = computed(
    () => this.selectedStatus() === PARA_STATUS.PENDING,
  );
  readonly canCancel = computed(
    () => this.selectedStatus() === PARA_STATUS.APPROVED,
  );

  // ========== TRIGGER ==========
  private readonly loadTrigger$ = new Subject<void>();
  private readonly clearSelection$ = new Subject<void>();
  readonly onClearSelection$ = this.clearSelection$.asObservable();

  // ========== CONSTRUCTOR ==========
  constructor() {
    // Tạo effect theo dõi, tracking state của các biến:
    /*
      - criteria(): tiêu chí tìm kiếm
      - currentPage: dữ liệu để phân trang 
      - pageSize: 
    */
    this.setupAutoReloadEffect();

    // Init pipeline RxJS duy nhất để xử lý data trong bảng
    this.setupDataLoadingPipeline();

    this.setupDiverseParaStatusAlertEffect();
  }

  // ========== PUBLIC API ==========
  search(criteria: PaymentChannelNativeSearchCriteria) {
    this.criteria.set(criteria ?? {});
    this.currentPage.set(0);
  }

  resetSearch() {
    this.criteria.set({});
    this.currentPage.set(0);
  }

  changePage(index: number) {
    this.currentPage.set(index);
  }

  changePageSize(size: number) {
    // Validate: must be a positive integer between 1 and 1000
    const validSize = Math.max(1, Math.min(1000, Math.floor(size) || 10));
    this.pageSize.set(validSize);
    this.currentPage.set(0); // Reset to first page when changing page size
  }

  setSelection(rows: PaymentChannelTableData[]) {
    this.selectedRows.set(rows);
  }

  reload() {
    this.loadTrigger$.next();
  }

  approveParaStatus(action: ApprovalAction): void {
    const rows = this.selectedRows();
    if (rows.length === 0) return;
    const currentStatus = this.selectedStatus();
    // Validate: mixed status
    if (currentStatus === null) {
      this.alerts
        .open('Các bản ghi được chọn phải có cùng trạng thái!', {
          appearance: 'error',
        })
        .subscribe();
      return;
    }
    // Validate: action ↔ current status
    const requiredStatus = ACTION_REQUIRED_STATUS[action];
    if (currentStatus !== requiredStatus) {
      const statusLabel =
        PARA_STATUS_LABELS[currentStatus] ?? `${currentStatus}`;
      this.alerts
        .open(
          `Action "${action}" không hợp lệ với trạng thái "${statusLabel}"!`,
          {
            appearance: 'error',
          },
        )
        .subscribe();
      return;
    }
    const ids = rows.map((r) => r.id);
    this.isUpdatingStatus.set(true);
    this.paymentService
      .approveParaStatus({ action, ids })
      .pipe(
        finalize(() => this.isUpdatingStatus.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          if (res?.status === 200 && res?.data) {
            const { totalUpdated, targetStatus } = res.data;
            const statusLabel =
              PARA_STATUS_LABELS[targetStatus] ?? `Trạng thái ${targetStatus}`;
            this.alerts
              .open(
                `Cập nhật thành công ${totalUpdated} bản ghi sang trạng thái "${statusLabel}"!`,
                { appearance: 'success' },
              )
              .subscribe();
            this.clearSelection();
            this.reload();
          }
        },
        error: (err) => {
          console.error('Approval failed', err);
          this.alerts
            .open('Cập nhật thất bại!', { appearance: 'error' })
            .subscribe();
        },
      });
  }

  // Nhận file trực tiếp và xử lý
  importExcel(file: File) {
    if (!file || !this.canImport()) return;

    this.isImporting.set(true);

    this.paymentService
      .importExcel(file)
      .pipe(
        finalize(() => this.isImporting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res: any) => {
          // Đọc headers thống kê từ response
          const successCount = parseInt(
            res.headers?.get?.('X-Import-Success') ?? '0',
            10,
          );
          const errorCount = parseInt(
            res.headers?.get?.('X-Import-Error') ?? '0',
            10,
          );

          if (res?.status === 200) {
            // Import thành công 100%
            this.alerts
              .open(`Import thành công ${successCount} dòng!`, {
                appearance: 'success',
              })
              .subscribe();
            this.reload();
            return;
          }

          if (res?.status === 201) {
            // Import một phần: có dòng lỗi
            const blob: Blob | null = res.body ?? null;
            if (blob) {
              const filename = getFilenameFromContentDisposition(
                res.headers?.get?.('Content-Disposition') ??
                  res.headers?.get?.('content-disposition'),
                'TEMPLATE_IMPORT_ERROR.xlsx',
              );
              downloadBlob(blob, filename);
            }

            this.alerts
              .open(
                `Số row import thành công: ${successCount} 
                Số row import lỗi: ${errorCount}. Vui lòng kiểm tra file lỗi`,
                { appearance: 'action' },
              )
              .subscribe();
            // Vẫn reload để cập nhật những dòng thành công (nếu có)
            this.reload();
            return;
          }

          console.error('Import thất bại: status không mong đợi', res?.status);
        },
        error: (err) => {
          console.error('Import thất bại', err);
          this.alerts
            .open('Import thất bại! Vui lòng thử lại.', { appearance: 'error' })
            .subscribe();
        },
      });
  }

  exportExcel() {
    if (!this.canExport()) return;

    this.isExporting.set(true);
    const request = this.buildSearchRequest(
      0,
      100,
      // 'id', 'asc'
    );
    const sanitized = sanitizeNativeSearchRequest(request);

    this.paymentService
      .exportExcel(sanitized)
      .pipe(
        finalize(() => this.isExporting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) =>
          this.downloadFromResponse(res, 'PARA_PAYMENT_CHANNEL.xlsx'),
        error: (err) => console.error('Export thất bại', err),
      });
  }

  exportTemplate() {
    if (!this.canExport()) return;

    this.isExporting.set(true);
    this.paymentService
      .exportTemplate()
      .pipe(
        finalize(() => this.isExporting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => this.downloadFromResponse(res, 'TEMPLATE.xlsx'),
        error: (err) => console.error('Export template thất bại', err),
      });
  }

  // ===========================
  // Internals
  // ===========================

  private clearSelection(): void {
    this.selectedRows.set([]);
    this.clearSelection$.next();
  }

  private setupAutoReloadEffect() {
    effect(() => {
      this.criteria();
      this.currentPage();
      this.pageSize(); // Track pageSize changes
      untracked(() => this.reload());
    });
  }

  private setupDiverseParaStatusAlertEffect() {
    effect(() => {
      const hasMixed = this.hasMixedStatus();
      if (hasMixed) {
        untracked(() => {
          this.alerts
            .open('Các bản ghi được chọn phải có cùng trạng thái tham số!', {
              appearance: 'warning',
            })
            .subscribe();
        });
      }
    });
  }

  // Init pipeline RxJS duy nhất để:
  /*
    - lắng nghe các request reload dữ liệu (thay đổi search, paging)
    - call API search
    - quản lý state loading
    - cập nhật data + pagination
  */
  private setupDataLoadingPipeline() {
    this.loadTrigger$
      .pipe(
        // debounceTime: khi code emit giá trị, nếu trong thời gian chờ mà có giá trị mới, hủy cũ lấy mới
        // chỉ lấy giá trị final trong 1 time của 1 event loop
        debounceTime(0),

        // bật flag isLoading
        tap(() => this.isLoading.set(true)),

        // switchMap: map giá trị emit từ Observable nguồn sang Observable mới
        //  đồng thời cancel Observable cũ nếu có giá trị mới xuất hiện
        switchMap(() => {
          const request = this.buildSearchRequest(
            this.currentPage(),
            this.pageSize(),
            // 'id',
            // 'asc',
          );
          const sanitized = sanitizeNativeSearchRequest(request);

          return this.paymentService.nativeSearch(sanitized).pipe(
            catchError((err) => {
              console.error('Lỗi tải dữ liệu:', err);
              return of(null);
            }),
            finalize(() => this.isLoading.set(false)),
          );
        }),

        // tự động unscribe toàn pipeline khi component bị destroy
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res: any) => {
        if (res?.status === 200 && res?.data) {
          this.rowData.set(res.data.items ?? []);
          this.totalPages.set(res.data.totalPage ?? 0);
          this.totalElements.set(res.data.totalElements ?? 0);
        } else {
          this.rowData.set([]);
          this.totalPages.set(0);
          this.totalElements.set(0);
        }
      });
  }

  private buildSearchRequest(
    pageNo: number,
    pageSize: number,
    // sortField: 'id',
    // sortDir: 'asc',
  ): PaymentChannelNativeSearchRequest {
    return {
      pageNo,
      pageSize,
      sortField: 'id',
      sortDir: 'asc',
      ...this.criteria(),
    };
  }

  private downloadFromResponse(res: any, fallback: string) {
    if (res?.status !== 200 || !res?.body) return;

    const filename = getFilenameFromContentDisposition(
      res.headers?.get?.('Content-Disposition') ??
        res.headers?.get?.('content-disposition'),
      fallback,
    );

    downloadBlob(res.body, filename);
  }
}
