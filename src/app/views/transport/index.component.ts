import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Transport } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { TransportService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transport',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalAddTransport') modalAddTransport: ModalDirective;
  @ViewChild('modalEditTransport') modalEditTransport: ModalDirective;
  @ViewChild('modalConfirmRemoveTransport') modalConfirmRemoveTransport: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public transports: Transport[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private TransportService: TransportService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.transports = [];
    this.transport = {};
    this.getTransports();
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
    this.getTransports(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getTransports(numberPage: number = 1) {    
    this.TransportService.getTransports(this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        this.spinner.hide();
        this.transports = result.data.transports;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  transport: any;
  getTransport(transport: any) {
    this.transport = transport;
    this.editTransportForm.setValue({
      name: transport.name, 
    });
  }

  deleteTransport() {
    this.spinner.show();
    this.TransportService.deleteTransport(this.transport).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveTransport.hide();
          this.dialog.show("The transport has been deleted", "success");
          this.getTransports(this.page);
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

  createTransport(){
    if (this.addTransportForm.invalid) {
      this.isAddTransportSubmitted = true;
      return;
    }
    const transport = this.editTransportForm.value;
    this.spinner.show();
    this.TransportService.createTransport(transport)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalAddTransport.hide();
          this.dialog.show("The transport has been added", "success");
          this.getTransports(this.page);
          this.clearAddTransportForm();
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

  editTransport(){
    if (this.editTransportForm.invalid) {
      this.isEditTransportSubmitted = true;
      return;
    }
    const transport = this.editTransportForm.value;
    transport.transport_id = this.transport.transport_id;
    this.spinner.show();
    this.TransportService.updateTransport(transport)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalEditTransport.hide();
          this.dialog.show("The transport has been edited", "success");
          this.getTransports(this.page);
          this.clearEditTransportForm();
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
  isAddTransportSubmitted: boolean = false;
  isEditTransportSubmitted: boolean = false;
  transportForm = new FormGroup({
    name: new FormControl("", [Validators.required,Validators.maxLength(255)]),
  });
  addTransportForm = this.transportForm;
  editTransportForm = this.transportForm;
  clearAddTransportForm() {
    this.addTransportForm.reset();
    this.addTransportForm.setValue({
      name: '',
    });
    this.isAddTransportSubmitted = false;
  }
  clearEditTransportForm() {
    this.editTransportForm.reset();
    this.editTransportForm.setValue({
      name: '',
    });
    this.isEditTransportSubmitted = false;
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    name: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      name: '',
    });
  }
}
