import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Option } from '../../core/models/common.model';
import { TuiIdentityMatcher, TuiStringMatcher } from '@taiga-ui/cdk';
import {
  TuiLabel,
  TuiLoader,
  TuiSizeL,
  TuiSizeS,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
} from '@taiga-ui/kit';
import { TuiComboBoxModule } from '@taiga-ui/legacy';

type Primitive = string | number;
@Component({
  selector: 'app-common-select-input',
  imports: [
    CommonModule,
    FormsModule,
    TuiTextfield,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiChevron,
    TuiLabel,
    TuiLoader,
  ],
  standalone: true,
  templateUrl: './common-select-input.html',
  styleUrl: './common-select-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonSelectInput),
      multi: true,
    },
  ],
})
export class CommonSelectInput<T extends Primitive = Primitive>
  implements ControlValueAccessor, OnChanges
{
  // ========== INPUT ==========
  @Input() options: readonly Option<T>[] = [];
  @Input() label = '';
  @Input() placeholder = 'Chọn giá trị';
  @Input({ transform: booleanAttribute }) searchable = true;
  @Input() emptyText = 'Không tìm thấy dữ liệu phù hợp';

  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) allowClear = false;
  @Input({ transform: booleanAttribute }) strict = false;
  @Input() controlName = '';

  // ========== STATE ==========
  // trạng thái disable của control
  protected disabled = false;
  // đối tượng Option<T> {value, label} đang được chọn , k phải primitive value
  protected selectedOption: Option<T> | null = null;

  // nếu option load async hoặc mảng option bị call lại, vẫn map lại được giá trị selectedOption
  private lastPrimitive: T | null = null;

  // chuyển item Option {value:label} thành string label hiển thị trong UI
  protected readonly stringify = (item: Option<T> | null): string =>
    item?.label ?? 'Lỗi khi tải dữ liệu';

  // item match nếu label chứa chuỗi search
  protected readonly matcher: TuiStringMatcher<Option<T>> = (item, search) =>
    item.label.toLowerCase().includes(search.toLowerCase());

  // so sánh 2 option có === không , dựa vào value
  protected readonly identityMatcher: TuiIdentityMatcher<Option<T>> = (a, b) =>
    a?.value === b?.value;

  // call back Angular form cung cấp: gọi khi value thay đổi ( component -> form)
  private onChange: (value: Option<T> | null) => void = () => {};

  // call back Angular form cung cấp: gọi khi control trigger touched:
  private onTouched: () => void = () => {};

  // ========== CVA ==========

  // Angular Form call khi muốn set giá trị từ form xuống component (form -> component)
  writeValue(value: Option<T> | null): void {
    this.lastPrimitive = value?.value ?? null;
    this.selectedOption =
      this.findOptionByValue(this.lastPrimitive) ?? value ?? null;
  }

  // Angular Form đăng ký callback onChange
  registerOnChange(fn: (value: Option<T> | null) => void): void {
    this.onChange = fn;
  }

  // Angular Form đăng ký callback onTouched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Angular Form call khi enable/disable control
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Lifecycle: chạy khi @Input thay đổi
  ngOnChanges(changes: SimpleChanges): void {
    // Nếu options thay đổi (async load hoặc parent tạo mảng mới)
    if (changes['options']) {
      // tìm lại option dựa theo primitive value cũ
      const mapped = this.findOptionByValue(this.lastPrimitive);

      // nếu tìm được thì set lại selectedOption để UI hiển thị đúng
      if (mapped) this.selectedOption = mapped;
    }
  }

  // ===== UI events =====

  // Handler khi user chọn option mới từ UI (ví dụ combobox change)
  protected handleModelChange(next: Option<T> | null): void {
    // cập nhật state UI
    this.selectedOption = next;

    // cập nhật primitive cache
    this.lastPrimitive = next?.value ?? null;

    // báo cho Angular Forms biết value đã đổi (component -> form)
    this.onChange(next);

    // mark touched vì user đã tương tác
    this.onTouched();
  }

  // Handler khi input blur: mark touched
  protected handleBlur(): void {
    this.onTouched();
  }

  // Helper: tìm Option trong options theo primitive value
  private findOptionByValue(value: T | null): Option<T> | null {
    // nếu value null/undefined thì không có selection
    if (value === null || value === undefined) return null;

    // tìm option có o.value == value
    return this.options.find((o) => o.value === value) ?? null;
  }
}
