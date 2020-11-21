import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Benefit } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { BenefitService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-benefit',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalAddBenefit') modalAddBenefit: ModalDirective;
  @ViewChild('modalEditBenefit') modalEditBenefit: ModalDirective;
  @ViewChild('modalConfirmRemoveBenefit') modalConfirmRemoveBenefit: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public benefits: Benefit[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private BenefitService: BenefitService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.benefits = [];
    this.benefit = {};
    this.getBenefits();
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
    this.getBenefits(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getBenefits(numberPage: number = 1) {    
    this.BenefitService.getBenefits(this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.benefits = result.data.benefits;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  benefit: any;
  getBenefit(benefit: any) {
    this.benefit = benefit;
    this.editBenefitForm.setValue({
      name: benefit.name, 
    });
  }

  deleteBenefit() {
    this.spinner.show();
    this.BenefitService.deleteBenefit(this.benefit).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveBenefit.hide();
          this.dialog.show("The benefit has been deleted", "success");
          this.getBenefits(this.page);
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

  createBenefit(){
    if (this.addBenefitForm.invalid) {
      this.isAddBenefitSubmitted = true;
      return;
    }
    const benefit = this.editBenefitForm.value;
    this.spinner.show();
    this.BenefitService.createBenefit(benefit)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalAddBenefit.hide();
          this.dialog.show("The benefit has been added", "success");
          this.getBenefits(this.page);
          this.clearAddBenefitForm();
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

  editBenefit(){
    if (this.editBenefitForm.invalid) {
      this.isEditBenefitSubmitted = true;
      return;
    }
    const benefit = this.editBenefitForm.value;
    benefit.benefit_id = this.benefit.benefit_id;
    this.spinner.show();
    this.BenefitService.updateBenefit(benefit)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalEditBenefit.hide();
          this.dialog.show("The benefit has been edited", "success");
          this.getBenefits(this.page);
          this.clearEditBenefitForm();
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
  isAddBenefitSubmitted: boolean = false;
  isEditBenefitSubmitted: boolean = false;
  benefitForm = new FormGroup({
    name: new FormControl("", [Validators.required,Validators.maxLength(255)]),
  });
  addBenefitForm = this.benefitForm;
  editBenefitForm = this.benefitForm;
  clearAddBenefitForm() {
    this.addBenefitForm.reset();
    this.addBenefitForm.setValue({
      name: '',
    });
    this.isAddBenefitSubmitted = false;
  }
  clearEditBenefitForm() {
    this.editBenefitForm.reset();
    this.editBenefitForm.setValue({
      name: '',
    });
    this.isEditBenefitSubmitted = false;
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
