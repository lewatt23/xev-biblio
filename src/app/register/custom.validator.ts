import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
