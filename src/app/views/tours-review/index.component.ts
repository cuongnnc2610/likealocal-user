import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToursReview } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ToursReviewService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hosts-review',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalConfirmRemoveToursReview') modalConfirmRemoveToursReview: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public toursReviews: ToursReview[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private ToursReviewService: ToursReviewService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.toursReviews = [];
    this.toursReview = new ToursReview();
    this.getToursReviews();
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
    this.getToursReviews(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getToursReviews(numberPage: number = 1) {    
    this.ToursReviewService.getToursReviews(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        console.log(result);
        result = result.data;
        this.spinner.hide();
        this.toursReviews = result.data;
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

  toursReview: ToursReview;
  getToursReview(toursReview: any) {
    this.toursReview = toursReview;
  }

  deleteToursReview() {
    this.spinner.show();
    this.ToursReviewService.deleteToursReview(this.toursReviews).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveToursReview.hide();
          this.dialog.show("The hosts review has been deleted", "success");
          this.getToursReviews(this.page);
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
    content: new FormControl("", []),
    tour_name: new FormControl("", []),
    host: new FormControl("", []),
    user: new FormControl("", []),
    date: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      content: '',
      tour_name: '',
      host: '',
      user: '',
      date: '',
    });
  }
}
