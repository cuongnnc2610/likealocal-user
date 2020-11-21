import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User, Order, Transaction, TransactionType } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { TransactionService, MasterDataService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  selector: 'app-transaction',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalDetailTransactionType1') modalDetailTransactionType1: ModalDirective;
  @ViewChild('modalConfirmRemoveUser') modalConfirmRemoveUser: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public transactions: Transaction[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private TransactionService: TransactionService,
    private MasterDataService: MasterDataService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.transactions = [];
    this.transaction = new Transaction();
    this.getTransactions();
    this.getCurrentBalanceOfSystem();
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

  transactionTypeSearchOptions = [
    {value: "", name: "All"},
    {value: 1, name: "User pays system"},
    {value: 2, name: "System refunds to user"},
    {value: 3, name: "System allows host to withdraw for tour"},
    {value: 4, name: "System allows host to withdraw for commission"},
    {value: 5, name: "Host withdraw"}];
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

  availableBalance: number;
  unavailableBalance: number;
  getCurrentBalanceOfSystem() {    
    this.TransactionService.getCurrentBalanceOfSystem().subscribe(
      (result) => {
        result = result.data;
        this.availableBalance = result.available_balance;
        this.unavailableBalance = result.unavailable_balance;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  transaction: Transaction;
  getTransaction(transaction: any) {
    this.transaction = transaction;
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

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
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
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
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
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--warning'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';
}
