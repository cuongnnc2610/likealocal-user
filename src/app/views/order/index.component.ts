import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User, Order } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { OrderService, MasterDataService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalEditOrder') modalEditOrder: ModalDirective;
  @ViewChild('modalConfirmRemoveUser') modalConfirmRemoveUser: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public orders: Order[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private OrderService: OrderService,
    private MasterDataService: MasterDataService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.orders = [];
    this.order = new Order();
    this.getOrders();
    this.translateLang();
  }

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
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

  statusSearchOptions = [{value: "", name: "All"}, {value: 1, name: "Unconfirmed"}, {value: 2, name: "Confirmed"}, {value: 3, name: "Completed"}];
  isCancelSearchOptions = [{value: "", name: "All"}, {value: true, name: "Cancelled"}, {value: false, name: "Not Cancelled"}];
  isPaidToSystemSearchOptions = [{value: "", name: "All"}, {value: true, name: "Paid"}, {value: false, name: "Unpaid"}];
  getOrders(numberPage: number = 1) {    
    this.OrderService.getOrders(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
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

  order: Order;
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
          this.modalEditOrder.hide();
          this.dialog.show("The order has been cancelled", "success");
          this.getOrders(this.page);
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
    });
  }
}
