import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User, Order, Transaction, TransactionType } from '../../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { TransactionService, MasterDataService, UserService, PaymentService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../../components';
import { NgxSpinnerService } from 'ngx-spinner';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalDetailTransactionType1') modalDetailTransactionType1: ModalDirective;
  @ViewChild('modalConfirmRemoveUser') modalConfirmRemoveUser: ModalDirective;
  @ViewChild('modalWithdraw') modalWithdraw: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private UserService: UserService,
    private TransactionService: TransactionService,
    private PaymentService: PaymentService,
    private MasterDataService: MasterDataService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getProfile();
    this.getTransactions();
    this.translateLang();
  }

  currentUser: any = new User();
  getProfile(){
    this.spinner.show();
    this.UserService.getProfile()
    .subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.currentUser = result.data;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  //PAGINATION
  currentPage(data: any) {
    this.spinner.show();
    this.getTransactions(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  public transactions: Transaction[] = [];
  transactionTypeSearchOptions = [
    {value: "", name: "All"},
    // {value: 1, name: "User pays system"},
    // {value: 2, name: "System refunds to user"},
    {value: 3, name: "Tours's income"},
    {value: 4, name: "Commission"},
    {value: 5, name: "Withdraw"}];
  getTransactions(numberPage: number = 1) {    
    this.TransactionService.getTransactions(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        console.log(result);
        result = result.data;
        this.spinner.hide();
        this.transactions = result.data;
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

  transaction: Transaction = new Transaction();
  discount: number = 0;
  tourOwnerCommission: number = 0;
  hostReceivedAmount: number = 0;
  systemCommission: number = 0;
  getTransaction(transaction: any) {
    this.transaction = transaction;

    // SET VALUE FOR modalDetailTransactionType34
    if (this.transaction.transaction_type_id === 3) {
      this.discount = Number((transaction.order.price * transaction.order.discount / 100).toFixed(2));
      this.tourOwnerCommission = Number(((transaction.order.price - this.discount) * 10 / 100).toFixed(2));
      this.systemCommission = Number((transaction.order.price - this.discount - this.tourOwnerCommission - transaction.amount).toFixed(2));
    }
    if (this.transaction.transaction_type_id === 4) {
      this.discount = Number((transaction.order.price * transaction.order.discount / 100).toFixed(2));
      this.hostReceivedAmount = Number(((transaction.order.price - this.discount) * 70 / 100).toFixed(2));
      this.systemCommission = Number((transaction.order.price - this.discount - this.hostReceivedAmount - transaction.amount).toFixed(2));
    }
    
  }

  isWithdrawSubmitted: boolean = false;
  requestWithdraw() {
    if (this.withdrawForm.invalid || this.withdrawForm.controls.amount_value.value > this.currentUser.balance) {
      this.isWithdrawSubmitted = true;
      return;
    }
    this.spinner.show();
    this.PaymentService.requestWithdraw(this.withdrawForm.controls).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.spinner.hide();
          this.modalWithdraw.hide();
          this.dialog.show('Your withdrawal request is being processed', 'success');

          this.currentUser.balance = Number((this.currentUser.balance - this.withdrawForm.controls.amount_value.value).toFixed(2));
          this.getTransactions();
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

  // WITHDRAW FORM
  withdrawForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.email,
    ]),
    amount_value: new FormControl("", [
      Validators.required,
      Validators.min(1),
      Validators.max(this.currentUser.balance)
    ]),
  });
  clearWithdrawForm() {
    this.withdrawForm.setValue({
      email: '',
      amount_value: '',
    });
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    order_id: new FormControl("", []),
    transaction_type_id: new FormControl("", []),
    host_email: new FormControl("", []),
    user_email: new FormControl("", []),
    // created_at: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      order_id: '',
      transaction_type_id: '',
      host_email: '',
      user_email: '',
      // created_at: '',
    });
  }

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--success'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}
