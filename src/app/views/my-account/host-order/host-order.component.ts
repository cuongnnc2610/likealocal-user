import {Component, OnDestroy, ViewChild, ElementRef, OnInit} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User, ToursImage, Order } from '../../../_models';
import { FormControl, FormGroup } from '@angular/forms';
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
  templateUrl: 'host-order.component.html',
  styleUrls:['host-order.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class HostOrderComponent implements OnInit  {
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
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private OrderService: OrderService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getHostOrders();
    this.translateLang();
  }

  //PAGINATION
  currentPage(data: any) {
    this.spinner.show();
    this.getHostOrders(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  isTimeForFinished: boolean;
  order: Order = new Order();
  getOrder(order: any) {
    this.order = order;

    // CHECK IF HOST CAN SELECT FINISH BUTTON
    const timeForFinshed = new Date(this.order.date_time.slice(0, -1) + this.order.toursHost.tour.city.utc_offset);
    timeForFinshed.setUTCHours(timeForFinshed.getUTCHours() + this.order.toursHost.tour.duration);
    this.isTimeForFinished = new Date() > timeForFinshed;
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

  confirmOrder(){
    this.spinner.show();
    this.OrderService.confirmOrder(this.order)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("The order has been confirmed", "success");
          this.order.status = 1;
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

  finishOrder(){
    this.spinner.show();
    this.OrderService.finishOrder(this.order)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("The order has been finished", "success");
          this.order.status = 2;
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

  statusSearchOptions = [{value: "", name: "All"}, {value: 0, name: "Unconfirmed"}, {value: 1, name: "Confirmed"}, {value: 2, name: "Finished"}];
  isCancelSearchOptions = [{value: "", name: "All"}, {value: true, name: "Cancelled"}, {value: false, name: "Not Cancelled"}];
  isPaidToSystemSearchOptions = [{value: "", name: "All"}, {value: true, name: "Paid"}, {value: false, name: "Unpaid"}];
  hostOfOrderSearchOptions = [{value: "0", name: "All"}, {value: "1", name: "Only yours"}, {value: "2", name: "Only others"}];
  getHostOrders(numberPage: number = 1) {    
    this.OrderService.getHostOrders(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
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


  // SEARCH FORM
  searchForm = new FormGroup({
    order_id: new FormControl("", []),
    is_paid_to_host: new FormControl("", []),
    host_name: new FormControl("", []),
    user_name: new FormControl("", []),
    tour_name: new FormControl("", []),
    is_paid_to_system: new FormControl("", []),
    is_cancelled: new FormControl("", []),
    date_time: new FormControl("", []),
    phone_number: new FormControl("", []),
    fullname: new FormControl("", []),
    status: new FormControl("", []),
    email: new FormControl("", []),
    created_at: new FormControl("", []),
    host_of_order: new FormControl("0", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      order_id: '',
      is_paid_to_host: '',
      host_name: '',
      user_name: '',
      tour_name: '',
      is_paid_to_system: '',
      is_cancelled: '',
      date_time: '',
      phone_number: '',
      fullname: '',
      status: '',
      email: '',
      created_at: '',
      host_of_order: '0'
    });
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
