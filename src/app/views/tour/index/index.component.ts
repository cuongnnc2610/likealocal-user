import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Coupon } from '../../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { TourService, MasterDataService, CategoryService, TransportService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../../components';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tour } from '../../../_models/tour';

@Component({
  selector: 'app-tour',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalEditTour') modalEditTour: ModalDirective;
  @ViewChild('modalConfirmRemoveTour') modalConfirmRemoveTour: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public tours = [];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private TourService: TourService,
    private MasterDataService: MasterDataService,
    private CategoryService: CategoryService,
    private TransportService: TransportService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.tours = [];
    this.tour = new Tour();
    this.getCategories();
    this.getTransports();
    this.getCountries();
    this.getToursByFilter();
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
    this.getToursByFilter(data);
  }

  orderType: number = 18; // unpublished first
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getToursByFilter(numberPage: number = 1) {
    this.TourService.getToursByFilter(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        result = result.data;
        this.spinner.hide();
        this.tours = result.data;
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

  tour: Tour;
  getTour(tour_id: any) {
    this.spinner.show();
    this.TourService.getTour(tour_id).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.tour = result.data;
        this.modalEditTour.show();
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  updateStatusOfTour(tour: any){
    this.spinner.show();
    this.TourService.updateStatusOfTour(tour)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalEditTour.hide();
          this.dialog.show("The tour status has been updated", "success");
          this.getToursByFilter(this.page);
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

  countries = [];
  country_id: any = '';
  getCountries() {
    this.MasterDataService.getCountries().subscribe(
      (result) => {
        this.countries = result.data.countries;
        this.countries.unshift({
          country_id: '',
          name: 'All'
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  cities = [];
  city_id: any = '';
  getCities() {
    if (this.searchInputForm.controls.country_id.value === '') {
      this.cities = [];
      this.searchInputForm.get('city_id').disable();
      return;
    }
    this.MasterDataService.getCities(this.searchInputForm.controls.country_id.value).subscribe(
      (result) => {
        this.searchInputForm.get('city_id').enable();
        this.cities = result.data.cities;
        this.cities.unshift({
          city_id: '',
          name: 'All'
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  categories = [];
  category_id: any = '';
  getCategories() {
    this.CategoryService.getCategories(null, 1).subscribe(
      (result) => {
        this.categories = result.data.categories;
        this.categories.unshift({
          category_id: '',
          name: 'All'
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  transports = [];
  transport_id: any = '';
  getTransports() {
    this.TransportService.getTransports(null, 1).subscribe(
      (result) => {
        this.transports = result.data.transports;
        this.transports.unshift({
          transport_id: '',
          name: 'All'
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  statusOptions = [{value: '', name: 'All'}, {value: 0, name: 'Unpublished'}, {value: 1, name: 'Rejected'}, {value: 2, name: 'Published'}]

  // SEARCH FORM
  searchForm = new FormGroup({
    name: new FormControl("", []),
    host_name: new FormControl("", []),
    country_id: new FormControl("", []),
    city_id: new FormControl("", []),
    category_id: new FormControl("", []),
    transport_id: new FormControl("", []),
    status: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      name: '',
      host_name: '',
      country_id: this.countries[0].country_id,
      city_id: '',
      category_id: this.categories[0].category_id,
      transport_id: this.transports[0].transport_id,
      status: '',
    });
  }
}
