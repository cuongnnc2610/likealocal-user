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

  public orders: Order[] = [];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  

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

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}
