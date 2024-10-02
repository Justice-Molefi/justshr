import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordStrength]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordStrengthDirective, multi: true}],
  standalone: true
})
export class PasswordStrengthDirective implements Validator {

  validate(control : AbstractControl): ValidationErrors | null{
    const value = control.value;
    const errors: ValidationErrors = {};
    
    // Check each requirement
    if (!/(?=.*[a-z])/.test(value)) errors['lowercase'] = true;
    if (!/(?=.*[A-Z])/.test(value)) errors['uppercase'] = true;
    if (!/(?=.*\d)/.test(value)) errors['number'] = true;
    if (!/(?=.*[@$!%#*?&_])/.test(value)) errors['special'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
