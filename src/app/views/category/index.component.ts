import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Category } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { CategoryService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-category',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalAddCategory') modalAddCategory: ModalDirective;
  @ViewChild('modalEditCategory') modalEditCategory: ModalDirective;
  @ViewChild('modalConfirmRemoveCategory') modalConfirmRemoveCategory: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public categories: Category[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private CategoryService: CategoryService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.categories = [];
    this.category = {};
    this.getCategories();
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
    this.getCategories(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getCategories(numberPage: number = 1) {    
    this.CategoryService.getCategories(this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        this.spinner.hide();
        this.categories = result.data.categories;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  category: any;
  getCategory(category: any) {
    this.category = category;
    this.editCategoryForm.setValue({
      name: category.name, 
    });
  }

  deleteCategory() {
    this.spinner.show();
    this.CategoryService.deleteCategory(this.category).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveCategory.hide();
          this.dialog.show("The category has been deleted", "success");
          this.getCategories(this.page);
        } else {
          this.modalConfirmRemoveCategory.hide();
          this.dialog.show(result.message, 'error');
        } 
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  createCategory(){
    if (this.addCategoryForm.invalid) {
      this.isAddCategorySubmitted = true;
      return;
    }
    const category = this.editCategoryForm.value;
    this.spinner.show();
    this.CategoryService.createCategory(category)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalAddCategory.hide();
          this.dialog.show("The category has been added", "success");
          this.getCategories(this.page);
          this.clearAddCategoryForm();
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

  editCategory(){
    if (this.editCategoryForm.invalid) {
      this.isEditCategorySubmitted = true;
      return;
    }
    const category = this.editCategoryForm.value;
    category.category_id = this.category.category_id;
    this.spinner.show();
    this.CategoryService.updateCategory(category)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalEditCategory.hide();
          this.dialog.show("The category has been edited", "success");
          this.getCategories(this.page);
          this.clearEditCategoryForm();
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
  isAddCategorySubmitted: boolean = false;
  isEditCategorySubmitted: boolean = false;
  categoryForm = new FormGroup({
    name: new FormControl("", [Validators.required,Validators.maxLength(255)]),
  });
  addCategoryForm = this.categoryForm;
  editCategoryForm = this.categoryForm;
  clearAddCategoryForm() {
    this.addCategoryForm.reset();
    this.addCategoryForm.setValue({
      name: '',
    });
    this.isAddCategorySubmitted = false;
  }
  clearEditCategoryForm() {
    this.editCategoryForm.reset();
    this.editCategoryForm.setValue({
      name: '',
    });
    this.isEditCategorySubmitted = false;
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
