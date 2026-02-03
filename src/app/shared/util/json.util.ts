import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const PARSED_JSON_KEY = '__parsedJson__';

export type JsonData = Record<string, unknown>;

export function jsonObjectValidator(maxKeys?: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;

    // Nếu component trả object sẵn
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      (control as any)[PARSED_JSON_KEY] = v;
      return validateKeyCount(v as JsonData, maxKeys);
    }

    const raw = (v ?? '')
      .toString()
      .replace(/^\uFEFF/, '')
      .trim();
    const text = raw === '' ? '{}' : raw;

    try {
      const parsed: unknown = JSON.parse(text);

      // bắt buộc là object, không nhận array/primitive
      if (
        parsed === null ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
        delete (control as any)[PARSED_JSON_KEY];
        return { jsonMustBeObject: true };
      }

      (control as any)[PARSED_JSON_KEY] = parsed;
      return validateKeyCount(parsed as JsonData, maxKeys);
    } catch (e: any) {
      delete (control as any)[PARSED_JSON_KEY];
      return { jsonInvalid: { message: e?.message } };
    }
  };
}

function validateKeyCount(
  obj: JsonData,
  maxKeys?: number
): ValidationErrors | null {
  if (maxKeys == null) return null;
  const count = Object.keys(obj).length;
  return count > maxKeys
    ? { jsonTooManyKeys: { maxKeys, actualKeys: count } }
    : null;
}

export function getCachedJsonObject(control: AbstractControl): JsonData {
  const cached = (control as any)[PARSED_JSON_KEY];
  if (cached && typeof cached === 'object' && !Array.isArray(cached)) {
    return cached as JsonData;
  }
  const raw = (control.value ?? '')
    .toString()
    .replace(/^\uFEFF/, '')
    .trim();
  const text = raw === '' ? '{}' : raw;
  const parsed: unknown = JSON.parse(text);

  // safety (tránh trả sai type)
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('jsonData must be an object');
  }
  return parsed as JsonData;
}
