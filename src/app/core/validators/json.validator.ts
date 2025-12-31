import { AbstractControl, ValidationErrors } from '@angular/forms';

export function jsonValidator(maxKeys = 50) {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const raw = (control.value ?? '').trim();
    const text = raw.length ? raw : '{}';
    try {
      const parsed = JSON.parse(text);

      if (
        parsed === null ||
        Array.isArray(parsed) ||
        typeof parsed !== 'object'
      ) {
        return { jsonObject: 'JSON data must be a JSON Object {"k":"v"}' };
      }

      const keys = Object.keys(parsed as Record<string, unknown>);
      if (keys.length > maxKeys) {
        return { jsonMaxKeys: `JSON data is over ${maxKeys} keys` };
      }
      return null;
    } catch (e: any) {
      return { jsonValid: e?.message ?? 'JSON parse error' };
    }
  };
}
