import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscriber } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { SubscriberService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-subscriber',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalAddSubscriber') modalAddSubscriber: ModalDirective;
  @ViewChild('modalEditSubscriber') modalEditSubscriber: ModalDirective;
  @ViewChild('modalConfirmRemoveSubscriber') modalConfirmRemoveSubscriber: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public subscribers: Subscriber[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private SubscriberService: SubscriberService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.subscribers = [];
    this.subscriber = {};
    this.getSubscribers();
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
    this.getSubscribers(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getSubscribers(numberPage: number = 1) {    
    this.SubscriberService.getSubscribers(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        result = result.data;
        this.spinner.hide();
        this.subscribers = result.data;
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

  subscriber: any;
  getSubscriber(subscriber: any) {
    this.subscriber = subscriber;
  }

  deleteSubscriber() {
    this.spinner.show();
    this.SubscriberService.deleteSubscriber(this.subscriber.subscriber_id).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveSubscriber.hide();
          this.dialog.show("The subscriber has been deleted", "success");
          this.getSubscribers(this.page);
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

  createSubscriber(){
    if (this.addSubscriberForm.invalid) {
      this.isAddSubscriberSubmitted = true;
      return;
    }
    const newSubscriber = this.addSubscriberForm.value;
    console.log(newSubscriber);
    this.spinner.show();
    this.SubscriberService.createSubscriber(newSubscriber)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalAddSubscriber.hide();
          this.dialog.show("The subscriber has been added", "success");
          this.getSubscribers(this.page);
          this.clearAddSubscriberForm();
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

  // ADD FORM
  isAddSubscriberSubmitted: boolean = false;
  subscriberForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  addSubscriberForm = this.subscriberForm;
  clearAddSubscriberForm() {
    this.addSubscriberForm.reset();
    this.addSubscriberForm.setValue({
      email: '',
    });
    this.isAddSubscriberSubmitted = false;
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    email: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      email: '',
    });
  }
}
