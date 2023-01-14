import { Luv2ShopValidators } from './../../validators/luv2-shop-validators';
import { State } from './../../common/state';
import { Country } from './../../common/country';
import { Luv2ShopFormService } from './../../services/luv2-shop-form.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkOutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService
  ) {}

  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace,
        ]),
        cardNumber: new FormControl('', [
          [Validators.required],
          Validators.pattern['[0-9]{16}'],
        ]),
        securityCode: new FormControl('', [
          [Validators.required],
          Validators.pattern['[0-9]{3}'],
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
    // Populate CreditCard Months
    const startMonth: number = new Date().getMonth() + 1;
    console.log(`The start months......${startMonth}`);
    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card info...' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
    // Populate CreditCard Years
    this.luv2ShopFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrived credit card years' + JSON.stringify(data));
      this.creditCardYears = data;
    });
    // Populates the countries and state
    this.luv2ShopFormService.getCountries().subscribe((data) => {
      console.log('Retrived Countries' + JSON.stringify(data));
      this.countries = data;
    });
  }
  get firstName() {
    return this.checkOutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkOutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkOutFormGroup.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkOutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkOutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkOutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkOutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkOutFormGroup.get('shippingAddress.country');
  }

  // billing getter address
  get billingAddressStreet() {
    return this.checkOutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkOutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkOutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkOutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkOutFormGroup.get('billingAddress.country');
  }
  get creditCardType() {
    return this.checkOutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkOutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkOutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkOutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkOutFormGroup.controls['billingAddress'].setValue(
        this.checkOutFormGroup.controls['shippingAddress'].value
      );

      // bug Fix code for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkOutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }
  onSubmit() {
    console.log('Handling the form Submit');
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
    }
    console.log(this.checkOutFormGroup.get('customer').value);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@');
  }
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup.value.expirationYear);
    // if current year and select year is same then we will start from current month
    let startMonth: number;
    if (currentYear == selectYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        this.creditCardMonths = data;
      });
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`contry code and name ### ${countryCode} ${countryName}`);
    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      formGroup.get('state').setValue(data[0]);
    });
  }
}
