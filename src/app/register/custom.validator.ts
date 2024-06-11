import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Tag } from '../dialog/dialog.component';

export const PasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmpassword = control.get('confirmPassword');
  if (password && confirmpassword && password.value != confirmpassword.value) {
    return {
      passwordmatcherror: true,
    };
  }
  return null;
};

export function minTagCountValidator(min: number = 1): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const tags: Tag[] = control.value;
    return tags.length >= min
      ? null
      : { minTagCount: { value: control.value, requiredCount: min } };
  };
}
