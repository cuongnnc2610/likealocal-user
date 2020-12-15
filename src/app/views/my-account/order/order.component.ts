import {Component, OnDestroy, ViewChild, ElementRef, OnInit} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User, ToursImage, Order } from '../../../_models';
import { FormGroup } from '@angular/forms';
import { DialogComponent } from '../../../components';
import { ActivatedRoute } from '@angular/router';
import { OrderService, ToursImageService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tour } from '../../../_models/tour';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var paypal: any;


@Component({
  templateUrl: 'order.component.html',
  styleUrls:['order.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class OrderComponent implements OnInit  {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild("modalPayment") modalPayment: ModalDirective;
  @ViewChild("paypal", { static: true }) paypalElement: ElementRef;


  public orders: Order[] = [];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public payPalConfig?: IPayPalConfig;

  constructor(
    private route: ActivatedRoute,
    private OrderService: OrderService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getOrders();

    // paypal.Buttons(this.paypalConfig).render(this.paypalElement.nativeElement);

    this.translateLang();
  }

  //PAGINATION
  currentPage(data: any) {
    this.spinner.show();
    this.getOrders(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getOrders(numberPage: number = 1) {    
    this.OrderService.getMyOrders(numberPage, this.orderType).subscribe(
      (result) => {
        console.log(result);
        result = result.data;
        this.spinner.hide();
        this.orders = result.data;
        this.total = result.total;
        this.pageSize = result.per_page;
        this.from = result.from;
        this.lastPage = result.last_page;
        this.page = numberPage;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  order: Order = new Order();
  getOrder(order: any) {
    this.order = order;
  }

  cancelOrder(){
    this.spinner.show();
    this.OrderService.cancelOrder(this.order)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("The order has been cancelled", "success");
          this.order.is_cancelled = true;
        } else {
          this.dialog.show(result.message, 'error');
        }
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
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

  paypalConfig: any;
  createPayment(order: any) {
    this.paypalElement.nativeElement.innerHTML = '';
    this.paypalConfig = {
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: "Manager To Owner Payment",
              amount: {
                currency_code: "USD",
                value: Number((order.price - order.price * order.discount / 100).toFixed(2))
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
        this.modalPayment.hide();
        this.dialog.show('Payment success', 'success');

        
        this.confirmPaid(0.1, order.id, order.payer.email_address);

      },
      onError: (err) => {
        this.dialog.show(err, 'error');
      }
    };

    // Render Paypal button
    paypal.Buttons(this.paypalConfig).render(this.paypalElement.nativeElement);
  }

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}
