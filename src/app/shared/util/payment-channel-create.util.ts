export type YesNoOption = { value: 0 | 1; label: 'Không' | 'Có' };

export interface SelectOption<T> {
  value: T;
  label: string;
}

export type ParaStatusOption = SelectOption<number>;
export type WebViewOption = SelectOption<number>;

export type ChannelStatus = SelectOption<string>;
export type CurrencyCode = SelectOption<string>;
export type ActiveStatus = SelectOption<number>;
