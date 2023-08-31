import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';

@Component({
  selector: 'app-accepted-offer',
  templateUrl: './accepted-offer.component.html',
  styleUrls: ['./accepted-offer.component.scss'],
})
export class AcceptedOfferComponent {
  acceptedOffers: any = [];
  acceptedOffer: any = {};
  tempAcceptedOffers: any = [];
  categories = [
    'Food Crops',
    'Feed Crops',
    'Fiber Crops',
    'Oil Crops',
    'Ornamental Crops',
    'Industrial Crops',
  ];

  confirmationDialog = false;

  categorySelected = '';

  page: number = 0;
  totalOffers: number = 0;

  constructor(
    private transactionService: TransactionService,
    private offerService: OfferService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTransactionsBySupplierId();
  }

  getTransactionsBySupplierId = () => {
    this.transactionService
      .getTransactionBySupplierId(this.authService.getUserId())
      .subscribe((data: any) => {
        this.tempAcceptedOffers = data.sort(
          (a: any, b: any) => b.transactionId - a.transactionId
        );
        this.tempAcceptedOffers = this.tempAcceptedOffers.filter(
          (offer: any) => offer.status === true
        );
        this.totalOffers = this.tempAcceptedOffers.length;
        this.acceptedOffers = this.tempAcceptedOffers.splice(this.page * 5, 5);
      });
  };

  onClear = () => {
    this.categorySelected = '';
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
    }
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.categorySelected = '';
  };

  onCancel = (acceptedOffer: any) => {
    this.acceptedOffer = acceptedOffer;
    this.confirmationDialog = true;
  };

  onCancelConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onConfirm = () => {
    const payload = {
      status: false,
    };
    this.transactionService
      .updateTransaction(this.acceptedOffer.transactionId, payload)
      .subscribe(() => {
        const payload1 = {
          isAccepted: false,
        };
        this.offerService
          .updateOffer(this.acceptedOffer.offer.offerId, payload1)
          .subscribe(() => {
            this.confirmationDialog = false;
            this.getTransactionsBySupplierId();
          });
      });
  };

  onPayment = (id: any) => {
    this.router.navigate([`/supplier/transaction/${id}`]);
  };
}