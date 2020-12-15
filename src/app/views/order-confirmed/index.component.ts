import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { TourService, CouponService, OrderService, MasterDataService} from '../../_services';
import {DialogComponent} from '../../components';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Coupon, Order, Tour, User } from '../../_models';
import { Language } from '../../_models/language';
import { ChangeDetectorRef } from '@angular/core';
declare var paypal: any;


@Component({
  selector: 'app-order-confirmed',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild('modalConfirmUpdate') modalConfirmUpdate: ModalDirective;
  @ViewChild("paypal", { static: false }) paypalElement: ElementRef;

  Math = Math;
  Number = Number;

  constructor(
    public TourService: TourService,
    public CouponService: CouponService,
    public OrderService: OrderService,
    public MasterDataService: MasterDataService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  orderId: number;

  ngOnInit(): void {
    this.spinner.show();
    this.route.queryParams.subscribe(params => {
      this.orderId = Number(params['order_id']);
    });
    this.getOrder();
  }

  isLoaded: boolean = false;
  order: Order = new Order();
  tour: Tour = new Tour();
  host: User = new User();
  getOrder() {
    this.OrderService.getOrder(this.orderId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.order = result.data;
          this.tour = result.data.toursHost.tour;
          this.host = result.data.toursHost.host;
          this.isLoaded = true;
          this.spinner.hide();
          this.changeDetectorRef.detectChanges();
          this.createPayment();
        } else {
          this.router.navigateByUrl('/404');
        }
        
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  paypalConfig: any;
  createPayment() {
    // this.paypalElement.nativeElement.innerHTML = '';
    this.paypalConfig = {
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: "Manager To Owner Payment",
              amount: {
                currency_code: "USD",
                value: Number((this.order.price - this.order.price * this.order.discount / 100).toFixed(2))
              }
            }
          ]
        });
      },
      onClick: () => {
        this.spinner.show();
      },
      onCancel: (data, actions) => {
        this.spinner.hide();
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log(order);
        console.log(data);
        this.spinner.hide();
        this.dialog.show('Payment success', 'success');
        this.confirmPaid(0.1, order.id, order.payer.email_adress);
        this.router.navigate(['/my-account/order']);
      },
      onError: (err) => {
        this.dialog.show(err, 'error');
      }
    };

    // Render Paypal button
    paypal.Buttons(this.paypalConfig).render(this.paypalElement.nativeElement);
  }

  confirmPaid(transactionFee, transactionNumber, sender){
    this.OrderService.confirmPaid(this.order, transactionFee, transactionNumber, sender)
    .subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        if (result.code !== 20001) {
          this.dialog.show(result.message, 'error');
        } else {
          this.order.is_paid_to_system = true;
        }
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  //TRANSLATE
  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}

