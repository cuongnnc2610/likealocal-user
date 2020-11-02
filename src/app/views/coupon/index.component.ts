import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Coupon } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { CouponService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-coupon',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalAddCoupon') modalAddCoupon: ModalDirective;
  @ViewChild('modalEditCoupon') modalEditCoupon: ModalDirective;
  @ViewChild('modalConfirmRemoveCoupon') modalConfirmRemoveCoupon: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public coupons: Coupon[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private CouponService: CouponService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.coupons = [];
    this.coupon = {};
    this.getCoupons();
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
    this.getCoupons(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getCoupons(numberPage: number = 1) {    
    this.CouponService.getCoupons(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        result = result.data;
        this.spinner.hide();
        this.coupons = result.data;
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

  coupon: any;
  getCoupon(coupon: any) {
    this.coupon = coupon;
    this.editCouponForm.setValue({
      code: coupon.code, 
      discount: coupon.discount,
      total_quantity: coupon.total_quantity,
      is_available: coupon.is_available
    });
  }

  deleteCoupon() {
    this.spinner.show();
    this.CouponService.deleteCoupon(this.coupon.coupon_id).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveCoupon.hide();
          this.dialog.show("The coupon has been deleted", "success");
          this.getCoupons(this.page);
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

  createCoupon(){
    if (this.addCouponForm.invalid) {
      this.isAddCouponSubmitted = true;
      return;
    }
    const newCoupon = this.addCouponForm.value;
    newCoupon.code = newCoupon.code.toUpperCase();
    console.log(newCoupon);
    this.spinner.show();
    this.CouponService.createCoupon(newCoupon)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalAddCoupon.hide();
          this.dialog.show("The coupon has been added", "success");
          this.getCoupons(this.page);
          this.clearAddCouponForm();
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

  editCoupon(){
    if (this.editCouponForm.invalid) {
      this.isEditCouponSubmitted = true;
      return;
    }
    const coupon = this.editCouponForm.value;
    coupon.coupon_id = this.coupon.coupon_id;
    // coupon.is_available = this.is_available;
    console.log(coupon);
    this.spinner.show();
    this.CouponService.updateCoupon(coupon)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalEditCoupon.hide();
          this.dialog.show("The coupon has been edited", "success");
          this.getCoupons(this.page);
          this.clearEditCouponForm();
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

  // ADD, EDIT FORM
  statusOptions = [{value: true, name: "Available"}, {value: false, name: "Unavailable"}];
  isAddCouponSubmitted: boolean = false;
  isEditCouponSubmitted: boolean = false;
  couponForm = new FormGroup({
    code: new FormControl("", [Validators.required,Validators.maxLength(255), ]),
    discount: new FormControl("1", [Validators.required,Validators.maxLength(2000),]),
    total_quantity: new FormControl("1", [Validators.required,Validators.maxLength(2000),]),
    is_available: new FormControl(this.statusOptions[0].value, []),
  });
  addCouponForm = this.couponForm;
  editCouponForm = this.couponForm;
  clearAddCouponForm() {
    this.addCouponForm.reset();
    this.addCouponForm.setValue({
      code: '',
      discount: '1',
      total_quantity: '1',
      is_available: this.statusOptions[0].value,
    });
    this.isAddCouponSubmitted = false;
  }
  clearEditCouponForm() {
    this.editCouponForm.reset();
    this.editCouponForm.setValue({
      code: '',
      discount: '1',
      total_quantity: '1',
      is_available: this.statusOptions[0].value,
    });
    this.isEditCouponSubmitted = false;
  }

  // SEARCH FORM
  filterOptions = [{value: "", name: "All"}, {value: true, name: "Available coupon"}, {value: false, name: "Unavailable coupon"}];
  searchForm = new FormGroup({
    code: new FormControl("", []),
    filter: new FormControl(this.filterOptions[0].value, []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      code: '',
      filter: this.filterOptions[0].value,
    });
  }
}
