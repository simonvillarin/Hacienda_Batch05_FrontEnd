import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ChangeAddressService } from 'src/app/shared/services/change-address/change-address.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  payments: any = [];
  payment: any = {};

  image: any;
  name: any;
  category: any;
  description: any;
  measurement: any;
  value: any;
  price: any;
  paymentIdRef: any;
  paymentDate: any;
  deliverDate: any;
  deliveredTo: any;
  contact: any;
  address: any;

  sales: any;
  soldCrops: any;

  usedColors: any = [];
  borders: any = [];
  colors: any = [];
  salesLabels: any = [];
  soldLabels: any = [];
  salesData: any = [];
  soldData: any = [];

  empty = true;
  detailsDialog = false;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private changeAddressService: ChangeAddressService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.paymentService
      .getPaymentByFarmerId(this.authService.getUserId())
      .subscribe(
        (res: any) => {
          this.payments = res.sort(
            (a: any, b: any) => b.paymentId - a.paymentId
          );

          const uniqueLabels = this.getUniqueObjects(this.payments);
          uniqueLabels.forEach((payment: any) => {
            const filter = this.payments.filter(
              (pay: any) =>
                pay.payment.transaction.offer.advertisement.name ===
                payment.payment.transaction.offer.advertisement.name
            );
            let sales = 0;
            sales = filter.reduce(
              (total: any, currentItem: any) =>
                total +
                currentItem.payment.transaction.offer.advertisement.price,
              0
            );
            this.salesData.push(sales);

            let qty = 0;
            qty = filter.reduce(
              (total: any, currentItem: any) =>
                total +
                currentItem.payment.transaction.offer.advertisement.value,
              0
            );
            this.soldData.push(qty);

            const measurement =
              payment.payment.transaction.offer.advertisement.measurement ===
              'Quantity'
                ? 'Quantity'
                : 'Kilos';
            const val =
              payment.payment.transaction.offer.advertisement.name +
              ' (' +
              measurement +
              ')';
            this.soldLabels.push(val);
            this.salesLabels.push(
              payment.payment.transaction.offer.advertisement.name
            );
            this.generateRandomColor();
          });

          this.sales = {
            labels: this.salesLabels,
            datasets: [
              {
                label: 'Sales',
                data: this.salesData,
                backgroundColor: this.colors,
                borderColor: this.borders,
                borderWidth: 1,
              },
            ],
          };

          this.soldCrops = {
            labels: this.soldLabels,
            datasets: [
              {
                label: 'Sold Crops',
                data: this.soldData,
                backgroundColor: this.colors,
                borderColor: this.borders,
                borderWidth: 1,
              },
            ],
          };
        },
        () => {
          this.authService.logout();
        }
      );
  }

  isObjectUnique = (obj1: any, obj2: any) => {
    return (
      obj1.payment.transaction.offer.advertisement.name ===
      obj2.payment.transaction.offer.advertisement.name
    );
  };

  getUniqueObjects = (arr: any) => {
    return arr.filter((item: any, index: any, self: any) => {
      return (
        self.findIndex((obj: any) => this.isObjectUnique(obj, item)) === index
      );
    });
  };

  onView = (payment: any) => {
    this.payment = payment;
    this.image = this.payment.payment.transaction.offer.advertisement.image;
    this.name = this.payment.payment.transaction.offer.advertisement.name;
    this.category =
      this.payment.payment.transaction.offer.advertisement.category;
    this.description =
      this.payment.payment.transaction.offer.advertisement.description;
    this.measurement =
      this.payment.payment.transaction.offer.advertisement.measurement;
    this.value = this.payment.payment.transaction.offer.value;
    this.price = this.payment.payment.transaction.offer.price;
    this.paymentIdRef = this.payment.payment.paymentIdRef;
    this.paymentDate = this.payment.payment.transaction.paidDate;
    this.deliverDate = this.payment.payment.transaction.deliverDate;

    console.log(payment.payment.transaction.supplier);

    this.changeAddressService
      .getChangeAddressByTransactionId(
        payment.payment.transaction.supplier.userId
      )
      .subscribe(
        (data: any) => {
          this.userService
            .getUserById(payment.payment.transaction.supplier.userId)
            .subscribe((res: any) => {
              this.deliveredTo =
                data.fullName ||
                res.firstName +
                  ' ' +
                  (res.middleName || '') +
                  ' ' +
                  res.lastName +
                  ' ' +
                  (res.suffix || '');
              this.contact = data.contact || res.contact;
              this.address =
                (data.unit || res.unit) +
                ', ' +
                (data.street || res.street) +
                ', ' +
                (data.village || res.village) +
                ', ' +
                (data.barangay || res.barangay) +
                ', ' +
                (data.city || res.city) +
                ', ' +
                (data.province || res.province) +
                ', ' +
                (data.region || res.region);
              this.detailsDialog = true;
            });
        },
        () => {
          this.userService
            .getUserById(payment.payment.transaction.supplier.userId)
            .subscribe((res: any) => {
              this.deliveredTo =
                res.firstName +
                ' ' +
                (res.middleName || '') +
                ' ' +
                res.lastName +
                ' ' +
                (res.suffix || '');
              this.contact = res.contact;
              this.address =
                res.unit +
                ', ' +
                res.street +
                ', ' +
                res.village +
                ', ' +
                res.barangay +
                ', ' +
                res.city +
                ', ' +
                res.province +
                ', ' +
                res.region;
              this.detailsDialog = true;
            });
        }
      );
  };

  onCloseDetailsDialog = () => {
    this.detailsDialog = false;
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

  generateRandomColor() {
    let randomColor: string;
    do {
      randomColor = this.getRandomColor();
    } while (this.usedColors.includes(randomColor));

    this.usedColors.push(randomColor);
    this.colors.push(`rgba(${randomColor}, 0.2)`);
    this.borders.push(`rgb(${randomColor})`);
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 101) + 100;
    const g = Math.floor(Math.random() * 101) + 100;
    const b = Math.floor(Math.random() * 101) + 100;
    return `${r},${g},${b}`;
  }
}
