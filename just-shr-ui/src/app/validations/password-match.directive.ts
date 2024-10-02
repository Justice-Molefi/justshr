import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true}],
  standalone: true
})
export class PasswordMatchDirective implements Validator{
  @Input() passwordKey? : string;
  @Input() confirmPasswordKey? : string;

  validate(formGroup : AbstractControl): ValidationErrors | null {

    if(!(formGroup instanceof FormGroup)){
      return null;
    }
    
    const passwordControl = formGroup.get(this.passwordKey!);
    const confirmPasswordControl = formGroup.get(this.confirmPasswordKey!);

    if(passwordControl && confirmPasswordControl)
      if(passwordControl.value !== confirmPasswordControl.value)
        return {'passwordMismatch': true}

    return null;
  }

}
