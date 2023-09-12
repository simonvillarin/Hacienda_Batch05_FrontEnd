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
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { PaymentDetailsService } from 'src/app/shared/services/payment-details/payment-details.service';
import { deliveryDateValidator } from 'src/app/shared/validators/custom.validator';
import { DatePipe } from '@angular/common';
import { ChangeAddressService } from 'src/app/shared/services/change-address/change-address.service';

@Component({
  selector: 'app-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  providers: [DatePipe],
})
export class TransactionHistoryComponent implements OnInit {
  paymentForm: FormGroup;

  todayDate = new Date();

  user: any = {};
  transactions: any = {};
  payment: any;
  farmer: any = {};
  offers: any = {};
  post: any = {};
  payments: any;
  paymentDetails: any;
  fullName: any;
  user1: any = {};

  isViewed = false;
  isPaid = false;
  isDelivered = false;
  confirmationDialog = false;

  changeAddress: any = {};

  ngOnInit(): void {
    this.getUserById();
    this.getPaymentById();
    this.getAllChangeAddress();
    this.getChangeAddressByTransactionId();
  }

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private userService: UserService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private offerService: OfferService,
    private advertisementService: AdvertisementService,
    private paymentDetailsService: PaymentDetailsService,
    private changeAddressService: ChangeAddressService,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      transactionId: [''],
      paymentAccountId: [''],
      paymentMode: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
    });
  }

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
      });
  };

  getPaymentById = () => {
    const param = this.route.snapshot.params['id'];

    this.paymentService.getPaymentById(param).subscribe((data: any) => {
      this.payments = data;

      const transactionId = data.transactionId;
      this.paymentService
        .getPaymentByTransactionId(transactionId)
        .subscribe((data) => {
          this.payment = data;
        });

      this.paymentDetailsService
        .getPaymentDetailsByTransactionId(transactionId)
        .subscribe((data) => {
          this.paymentDetails = data;
        });

      this.transactionService
        .getTransactionById(transactionId)
        .subscribe((data: any) => {
          this.transactions = data;

          if (data.paidDate) {
            this.isPaid = true;
          }
          if (data.deliveredDate) {
            this.isDelivered = true;
          }

          this.userService
            .getUserById(this.transactions.supplierId)
            .subscribe((res: any) => {
              this.fullName =
                res.firstName +
                ' ' +
                (res.middleName || '') +
                ' ' +
                res.lastName +
                ' ' +
                (res.suffix || '');
              this.user1 = res;
            });

          const offerId = data.offerId;
          this.offerService.getOfferById(offerId).subscribe((data: any) => {
            this.offers = data;

            const postId = data.postId;
            this.advertisementService
              .getAdById(postId)
              .subscribe((data: any) => {
                this.post = data;
              });
          });

          const farmerId = data.farmerId;
          this.userService.getUserById(farmerId).subscribe((data: any) => {
            this.farmer = data;
          });
        });
    });
  };

  getChangeAddressByTransactionId = () => {
    const param = this.route.snapshot.params['id'];

    this.paymentService.getPaymentById(param).subscribe((data: any) => {
      this.payments = data;

      const transactionId = data.transactionId;
      this.paymentService
        .getPaymentByTransactionId(transactionId)
        .subscribe((data) => {
          this.payment = data;

          this.transactionService
            .getTransactionById(transactionId)
            .subscribe((data) => {
              this.changeAddressService
                .getChangeAddressByTransactionId(data.supplierId)
                .subscribe((data: any) => {
                  this.changeAddress = data;
                });
            });
        });
    });
  };

  getAllChangeAddress = () => {
    this.changeAddressService.getAllChangeAddress().subscribe((data) => {
      this.changeAddress = data;
      console.log(data);
    });
  };

  updateDelivery = () => {
    this.confirmationDialog = true;
  };

  onConfirm = () => {
    const payload = {
      deliveredDate: '2023-02-21',
      deliveredTime: '11:56:22',
    };

    this.transactionService
      .updateTransaction(this.transactions.transactionId, payload)
      .subscribe(() => {
        this.confirmationDialog = false;
        this.getPaymentById();
      });
  };

  onCancelConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  convertTime = (time: any) => {
    if (time) {
      const splitTime = time.split(':');
      let hour;
      let zone;
      if (parseInt(splitTime[0]) == 13) {
        hour = 1;
      } else if (parseInt(splitTime[0]) == 13) {
        hour = 1;
      } else if (parseInt(splitTime[0]) == 14) {
        hour = 2;
      } else if (parseInt(splitTime[0]) == 15) {
        hour = 3;
      } else if (parseInt(splitTime[0]) == 16) {
        hour = 4;
      } else if (parseInt(splitTime[0]) == 17) {
        hour = 5;
      } else if (parseInt(splitTime[0]) == 18) {
        hour = 6;
      } else if (parseInt(splitTime[0]) == 19) {
        hour = 7;
      } else if (parseInt(splitTime[0]) == 20) {
        hour = 8;
      } else if (parseInt(splitTime[0]) == 21) {
        hour = 9;
      } else if (parseInt(splitTime[0]) == 22) {
        hour = 10;
      } else if (parseInt(splitTime[0]) == 23) {
        hour = 11;
      } else if (parseInt(splitTime[0]) == 24 || splitTime[0] == '00') {
        hour = 12;
      } else {
        hour = splitTime[0];
      }

      if (parseInt(splitTime[0]) > 12) {
        zone = 'PM';
      } else {
        zone = 'AM';
      }

      return hour + ':' + splitTime[1] + ' ' + zone;
    } else {
      return null;
    }
  };
}
