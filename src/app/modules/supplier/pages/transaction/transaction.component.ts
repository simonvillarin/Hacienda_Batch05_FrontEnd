import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { PaymentDetailsService } from 'src/app/shared/services/payment-details/payment-details.service';
import { PaymentAccountService } from 'src/app/shared/services/payment-account/payment-account.service';
import { DatePipe } from '@angular/common';
import {
  changeMobileNumberValidator,
  mobileNumberValidator,
} from 'src/app/shared/validators/custom.validator';
import { ChangeAddressService } from 'src/app/shared/services/change-address/change-address.service';
import { AddressService } from 'src/app/shared/services/address/address.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  providers: [DatePipe],
})
export class TransactionComponent implements OnInit {
  paymentForm: FormGroup;
  addressForm: FormGroup;
  transactionForm: FormGroup;

  todayDate = new Date();

  error = false;
  alert = false;
  isError = false;
  billingAddress = false;
  confirmationDialog = false;
  confirmationDialog1 = false;
  shippingDialog = false;
  isPaid = false;
  isDelivered = false;
  isEmptyChangeAddress = true;

  user: any = {};
  farmers: any = {};
  farmer: any;
  offers: any = {};
  transactions: any = {};
  payment: any;
  payments: any;
  alertMessage: string = '';
  post: any = {};
  paymentDetails: any;
  paymentAccount: any;
  paidDate: any;
  allPayments: any = {};
  changeAddress: any = {};
  fullN: any;

  barangays: any = [];
  cities: any = [];
  provinces: any = [];
  regions: any = [];

  tempBarangays: any = [];
  tempCities: any = [];
  tempProvinces: any = [];
  tempRegions: any = [];

  regionSelected: any;
  provinceSelected: any;
  citySelected: any;
  barangaySelected: any;

  ngOnInit(): void {
    this.getUserById();
    this.getTransactionById();
    this.getPaymentAccountByFarmerId();
    this.getAllPayments();
    this.getBarangay();
    this.getCity();
    this.getProvince();
    this.getRegion();
    this.getChangeAddressByTransactionId();
  }

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private userService: UserService,
    private offerService: OfferService,
    private transactionService: TransactionService,
    private advertisementService: AdvertisementService,
    private paymentDetailsService: PaymentDetailsService,
    private paymentAccountService: PaymentAccountService,
    private changeAddressService: ChangeAddressService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      transactionId: [''],
      paymentAccountId: [''],
      paymentMode: ['', Validators.required],
      accountNumber: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(17),
        ],
      ],
      accountName: [
        '',
        [
          Validators.required,
          // Validators.minLength(3),
          // Validators.maxLength(80),
        ],
      ],
      fullName: ['', Validators.required],
      unit: ['', Validators.required],
      street: ['', Validators.required],
      village: ['', Validators.required],
      barangay: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      region: ['', Validators.required],
      contact: ['', Validators.required],
    });

    this.addressForm = this.fb.group({
      transactionId: [''],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      unit: ['', Validators.required],
      street: ['', Validators.required],
      village: ['', Validators.required],
      barangay: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      region: ['', Validators.required],
      contact: ['', [Validators.required, changeMobileNumberValidator()]],
    });

    this.transactionForm = this.fb.group({
      paidDate: [''],
      paidTime: [''],
    });
  }

  get paymentMode() {
    return this.paymentForm.get('paymentMode') as FormControl;
  }

  get accountNumber() {
    return this.paymentForm.get('accountNumber') as FormControl;
  }

  get accountName() {
    return this.paymentForm.get('accountName') as FormControl;
  }

  get expirationDate() {
    return this.paymentForm.get('expirationDate') as FormControl;
  }

  get securityCode() {
    return this.paymentForm.get('securityCode') as FormControl;
  }

  get fullName() {
    return this.addressForm.get('fullName') as FormControl;
  }

  get unit() {
    return this.addressForm.get('unit') as FormControl;
  }

  get street() {
    return this.addressForm.get('street') as FormControl;
  }

  get village() {
    return this.addressForm.get('village') as FormControl;
  }

  get barangay() {
    return this.addressForm.get('barangay') as FormControl;
  }

  get city() {
    return this.addressForm.get('city') as FormControl;
  }

  get province() {
    return this.addressForm.get('province') as FormControl;
  }

  get region() {
    return this.addressForm.get('region') as FormControl;
  }

  get contact() {
    return this.addressForm.get('contact') as FormControl;
  }

  getBarangay = () => {
    this.addressService.getBarangay().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempBarangays.push(arr);
      });
    });
  };

  getCity = () => {
    this.addressService.getCity().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempCities.push(arr);
      });
    });
  };

  getProvince = () => {
    this.addressService.getProvince().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempProvinces.push(arr);
      });
    });
  };

  getRegion = () => {
    this.addressService.getRegion().subscribe((data: any) => {
      data.map((region: any) => {
        this.regions.push(region);
      });
    });
  };

  onRegionChange = (region: any) => {
    if (region != '') {
      this.barangays = [];
      this.cities = [];
      this.provinces = [];
      this.provinces = this.tempProvinces.filter(
        (province: any) => province.region_code === region.id
      );
    }
  };

  onProvinceChange = (province: any) => {
    if (province != '') {
      this.barangays = [];
      this.cities = [];
      this.cities = this.tempCities.filter(
        (city: any) => city.province_code == province.id
      );
    }
  };

  onCityChange = (city: any) => {
    if (city != '') {
      this.barangays = [];
      this.barangays = this.tempBarangays.filter(
        (barangay: any) => barangay.city_code == city.id
      );
    }
  };

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
        this.fullN =
          data.firstName +
          ' ' +
          (data.middleName || '') +
          ' ' +
          data.lastName +
          ' ' +
          (data.suffix + '');
      });
  };

  getTransactionById = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;

      if (data.paidDate) {
        this.isPaid = true;
      }
      if (data.deliverDate) {
        this.isDelivered = true;
      }

      this.paymentService
        .getPaymentByTransactionId(param)
        .subscribe((res: any) => {
          if (data.paidDate) {
            this.router.navigate([`/supplier/payment/${res.paymentId}`]);
          }
        });

      this.paymentForm.patchValue({
        transactionId: this.transactions.transactionId,
      });

      this.addressForm.patchValue({
        transactionId: this.transactions.transactionId,
      });

      const offerId = data.offerId;
      this.offerService.getOfferById(offerId).subscribe((data: any) => {
        this.offers = data;

        const postId = data.postId;
        this.advertisementService.getAdById(postId).subscribe((data: any) => {
          this.post = data;
        });
      });

      const farmerId = data.farmerId;
      this.userService.getUserById(farmerId).subscribe((data: any) => {
        this.farmers = data;
      });
    });
  };

  getPaymentByTransactionId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;

      this.paymentForm.patchValue({
        transactionId: this.transactions.transactionId,
        paymentAccountId: this.paymentAccount.paymentAccountId,
      });

      const transactionId = data.transactionId;
      this.paymentService
        .getPaymentByTransactionId(transactionId)
        .subscribe((data) => {
          this.payment = data;

          this.transactionForm.patchValue({
            paidDate: this.payment.paymentDate,
            paidTime: this.payment.paymentTime,
          });

          const payload = {
            paidDate: this.payment.paymentDate,
            paidTime: this.payment.paymentTime,
            isViewed: true,
          };

          this.transactionService
            .updateTransaction(this.transactions.transactionId, payload)
            .subscribe();

          const id = data.paymentId;
          scroll(0, 0);
          this.router.navigate([`/supplier/payment/${id}`]);
        });
    });
  };

  getPaymentDetailsByTransactionId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;
      console.log(data);

      const transactionId = this.transactions.transactionId;
      this.paymentDetailsService
        .getPaymentDetailsByTransactionId(transactionId)
        .subscribe((data) => {
          this.paymentDetails = data;
          console.log(data);

          this.getPaymentByTransactionId();
        });
    });
  };

  getPaymentAccountByFarmerId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;

      const farmerId = this.transactions.farmerId;
      this.paymentAccountService
        .getPaymentAccountByFarmerId(farmerId)
        .subscribe((data: any) => {
          this.paymentAccount = data;
          console.log('Payment Account By Farmer ID:', data);
          this.paymentForm.patchValue({
            paymentAccountId: this.paymentAccount.paymentAccountId,
          });
        });
    });
  };

  getAllPayments = () => {
    this.paymentService.getAllPayments().subscribe((data) => {
      console.log(data);
    });
  };

  getAllChangeAddress = () => {
    this.changeAddressService.getAllChangeAddress().subscribe((data) => {
      this.changeAddress = data;
    });
  };

  getChangeAddressByTransactionId = () => {
    this.changeAddressService
      .getChangeAddressByTransactionId(this.authService.getUserId())
      .subscribe((data: any) => {
        this.changeAddress = data;
        console.log(data);

        if (data) {
          this.isEmptyChangeAddress = false;
        } else {
          this.isEmptyChangeAddress = true;
        }
      });
  };

  onSubmit = () => {
    const fullName =
      this.user.firstName +
      ' ' +
      this.user.middleName +
      ' ' +
      this.user.lastName +
      ' ' +
      this.user.suffix;

    this.paymentForm.patchValue({
      fullName: fullName,
      unit: this.user.unit,
      street: this.user.street,
      village: this.user.village,
      barangay: this.user.barangay,
      city: this.user.city,
      province: this.user.province,
      region: this.user.region,
      contact: this.user.contact,
    });

    if (this.paymentForm.valid) {
      this.confirmationDialog = true;
    } else {
      this.paymentForm.markAllAsTouched();
    }
  };

  onConfirm = () => {
    this.paymentService.addPayment(this.paymentForm.value).subscribe(() => {
      const radioButtons =
        this.elementRef.nativeElement.querySelectorAll('.radio');
      radioButtons.forEach((radio: any) => {
        this.renderer.setProperty(radio, 'checked', false);
      });

      this.paymentDetailsService
        .addPaymentDetails(this.paymentForm.value)
        .subscribe(() => {
          this.confirmationDialog = false;
        });

      this.getPaymentByTransactionId();
      this.getPaymentDetailsByTransactionId();
    });
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onMethodChange = (paymentMode: string) => {
    if (paymentMode != '') {
      this.billingAddress = true;
      this.paymentForm.patchValue({
        paymentMode: paymentMode,
      });
    }
  };

  onChange = () => {
    if (this.addressForm.valid) {
      this.confirmationDialog1 = true;
    } else {
      this.addressForm.markAllAsTouched();
    }
  };

  onConfirm1 = () => {
    this.addressForm.patchValue({
      transactionId: this.authService.getUserId(),
      region: this.addressForm.get('region')?.value.name,
      province: this.addressForm.get('province')?.value.name,
      city: this.addressForm.get('city')?.value.name,
      barangay: this.addressForm.get('barangay')?.value.name,
    });

    if (!this.isEmptyChangeAddress) {
      this.changeAddressService
        .updateChangeAddress(
          this.changeAddress.changeAddressId,
          this.addressForm.value
        )
        .subscribe(() => {
          this.confirmationDialog1 = false;
          this.changeDialog = false;
          this.getChangeAddressByTransactionId();
        });
    } else {
      this.changeAddressService
        .addChangeAddress(this.addressForm.value)
        .subscribe(() => {
          this.confirmationDialog1 = false;
          this.changeDialog = false;
          this.getChangeAddressByTransactionId();
        });
    }
  };

  changeDialog = false;
  updateChangeDialog = false;
  cardDialog = false;
  gCashDialog = false;
  payMayaDialog = false;
  placeOfferDialog = false;

  onChangeDialog = () => {
    this.changeDialog = true;

    this.changeAddressService
      .getChangeAddressByTransactionId(this.authService.getUserId())
      .subscribe(
        (data: any) => {
          this.addressForm.patchValue({
            fullName: data.fullName,
            contact: data.contact,
            unit: data.unit,
            street: data.street,
            village: data.village,
          });

          this.addressService.getRegion().subscribe((data: any) => {
            data.map((region: any) => {
              this.regions.push(region);
            });
            let indexOfRegion: number = 0;
            this.regions.forEach((region: any, i: number) => {
              if (region.name === data.region) {
                indexOfRegion = i;
              }
            });
            this.regionSelected = this.regions[indexOfRegion];

            this.addressService.getProvince().subscribe((data: any) => {
              data.map((arr: any) => {
                this.tempProvinces.push(arr);
              });

              this.provinces = this.tempProvinces.filter(
                (province: any) =>
                  province.region_code === this.regionSelected.id
              );
              let index: number = 0;
              this.provinces.forEach((province: any, i: number) => {
                if (province.name === data.province) {
                  index = i;
                }
              });
              this.provinceSelected = this.provinces[index];

              this.addressService.getCity().subscribe((data: any) => {
                data.map((arr: any) => {
                  this.tempCities.push(arr);
                });

                this.cities = this.tempCities.filter(
                  (city: any) => city.province_code == this.provinceSelected.id
                );

                let index: number = 0;
                this.cities.forEach((city: any, i: number) => {
                  if (city.name == data.city) {
                    index = i;
                  }
                });
                this.citySelected = this.cities[index];

                this.addressService.getBarangay().subscribe((data: any) => {
                  data.map((arr: any) => {
                    this.tempBarangays.push(arr);
                  });

                  this.barangays = this.tempBarangays.filter(
                    (barangay: any) =>
                      barangay.city_code == this.citySelected.id
                  );

                  let index: number = 0;
                  this.barangays.forEach((barangay: any, i: number) => {
                    if (barangay.name === data.barangay) {
                      index = i;
                    }
                  });
                  this.barangaySelected = this.barangays[index];
                });
              });
            });
          });
        },
        () => {
          this.addressForm.patchValue({
            fullName:
              this.user.firstName +
              ' ' +
              this.user.middleName +
              ' ' +
              this.user.lastName +
              ' ' +
              this.user.suffix,
            contact: this.user.contact,
            unit: this.user.unit,
            street: this.user.street,
            village: this.user.village,
          });

          this.addressService.getRegion().subscribe((data: any) => {
            data.map((region: any) => {
              this.regions.push(region);
            });
            let indexOfRegion: number = 0;
            this.regions.forEach((region: any, i: number) => {
              if (region.name === this.user.region) {
                indexOfRegion = i;
              }
            });
            this.regionSelected = this.regions[indexOfRegion];

            this.addressService.getProvince().subscribe((data: any) => {
              data.map((arr: any) => {
                this.tempProvinces.push(arr);
              });

              this.provinces = this.tempProvinces.filter(
                (province: any) =>
                  province.region_code === this.regionSelected.id
              );
              let index: number = 0;
              this.provinces.forEach((province: any, i: number) => {
                if (province.name === this.user.province) {
                  index = i;
                }
              });
              this.provinceSelected = this.provinces[index];

              this.addressService.getCity().subscribe((data: any) => {
                data.map((arr: any) => {
                  this.tempCities.push(arr);
                });

                this.cities = this.tempCities.filter(
                  (city: any) => city.province_code == this.provinceSelected.id
                );

                let index: number = 0;
                this.cities.forEach((city: any, i: number) => {
                  if (city.name == this.user.city) {
                    index = i;
                  }
                });
                this.citySelected = this.cities[index];

                this.addressService.getBarangay().subscribe((data: any) => {
                  data.map((arr: any) => {
                    this.tempBarangays.push(arr);
                  });

                  this.barangays = this.tempBarangays.filter(
                    (barangay: any) =>
                      barangay.city_code == this.citySelected.id
                  );

                  let index: number = 0;
                  this.barangays.forEach((barangay: any, i: number) => {
                    if (barangay.name === this.user.barangay) {
                      index = i;
                    }
                  });
                  this.barangaySelected = this.barangays[index];
                });
              });
            });
          });
        }
      );
  };

  onCloseConfirmationDialog1 = () => {
    this.confirmationDialog1 = false;
  };

  closeOnChangeDialog = () => {
    this.changeDialog = false;
  };

  onCardDialog = () => {
    this.cardDialog = true;
  };

  closeOnCardDialog = () => {
    this.cardDialog = false;
  };

  onGCashDialog = () => {
    this.gCashDialog = true;
  };

  onPayMayaDialog = () => {
    this.payMayaDialog = true;
  };

  onPlaceOfferDialog = () => {
    this.placeOfferDialog = true;
  };

  closeOnPlaceOfferDialog = () => {
    this.placeOfferDialog = false;
  };
}
