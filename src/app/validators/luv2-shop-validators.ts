import { FormControl, ValidationErrors } from '@angular/forms';

export class Luv2ShopValidators {
  static notOnlyWhiteSpace(control: FormControl): ValidationErrors {
    if (control.value != null && control.value.trim().length === 0) {
      //return invalid object
      return { notOnlyWhiteSpace: true };
    } else {
      //valid
      return null;
    }
  }
}
