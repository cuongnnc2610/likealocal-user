import {Component, OnInit, ViewChild} from '@angular/core';
import {MasterDataService, CategoryService, TransportService, TourService} from '../../_services';
import {DialogComponent} from '../../components';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { Country, Tour } from '../../_models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tour-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild('modalConfirmUpdate') modalConfirmUpdate: ModalDirective;

  Math = Math;
  Number = Number;

  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public to: number = 0;
  public lastPage: any; // Total page  

  constructor(
    public MasterDataService: MasterDataService,
    public CategoryService: CategoryService,
    public TransportService: TransportService,
    public TourService: TourService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.translateLang();
    this.spinner.show();
    this.route.queryParams.subscribe(params => {
      this.country_id = Number(params['country_id']);
    });
    if (isNaN(this.country_id)) {
      this.router.navigateByUrl('/home');
    } else {
      this.getCountries();
      this.getCategories();
      this.getTransports();
      this.getTours();
    }
  }

  orderType: number = 15;
  tours: Tour[] = [];
  getTours(numberPage: number = 1) {
    this.tours = [];
    this.spinner.show();
    this.TourService.getTours(numberPage, 9, this.country_id, this.city_id, this.category_id, this.transport_id, '', this.orderType).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.spinner.hide();
          result = result.data;
          this.tours = result.data;
          this.total = result.total;
          this.pageSize = result.per_page;
          this.from = result.from;
          this.to = result.to;
          this.lastPage = result.last_page;
          this.page = numberPage;
        }
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  isCountriesShown: boolean = false;
  showAllCountries() {
    this.isCitiesShown = false;
    this.isCategoriesShown = false;
    this.isTransportsShown = false;

    this.isCountriesShown = !this.isCountriesShown;
  }

  isCitiesShown: boolean = false;
  showAllCities() {
    this.isCountriesShown = false;
    this.isCategoriesShown = false;
    this.isTransportsShown = false;

    this.isCitiesShown = !this.isCitiesShown;
  }

  isCategoriesShown: boolean = false;
  showAllCategories() {
    this.isCountriesShown = false;
    this.isCitiesShown = false;
    this.isTransportsShown = false;

    this.isCategoriesShown = !this.isCategoriesShown;
  }

  isTransportsShown: boolean = false;
  showAllTransports() {
    this.isCountriesShown = false;
    this.isCitiesShown = false;
    this.isCategoriesShown = false;

    this.isTransportsShown = !this.isTransportsShown;
  }

  isPricesShown: boolean = false;
  showAllPrices() {
    this.isCountriesShown = false;
    this.isCitiesShown = false;
    this.isCategoriesShown = false;

    this.isPricesShown = !this.isPricesShown;
  }

  selectCountry(event: any, country: any) {
    this.country_id = country.country_id;

    const spanSelectingCity = document.getElementById('selecting-city');
    spanSelectingCity.innerHTML= 'All';
    this.cities = [];
    this.city_id = '';

    const spanSelectingCountry = document.getElementById('selecting-country');
    spanSelectingCountry.innerHTML= country.name;
    
    this.getCities();
  }

  selectCity(event: any, city: any) {
    this.city_id = city.city_id;

    const spanSelectingCity = document.getElementById('selecting-city');
    spanSelectingCity.innerHTML= city.name;
  }

  selectCategory(event: any, category: any) {
    this.category_id = category.category_id;

    const spanSelectingCategory = document.getElementById('selecting-category');
    spanSelectingCategory.innerHTML= category.name;
  }

  selectTransport(event: any, transport: any) {
    this.transport_id = transport.transport_id;

    const spanSelectingTransport = document.getElementById('selecting-transport');
    spanSelectingTransport.innerHTML= transport.name;
  }

  selectPrice(event: any, orderType: number) {
    this.orderType = orderType;

    const aBestSeller = document.getElementById('best-seller');
    aBestSeller.classList.remove('text-primary');
    aBestSeller.classList.add('text-gray-1');

    const aTopReviewed = document.getElementById('top-reviewed');
    aTopReviewed.classList.remove('text-primary');
    aTopReviewed.classList.add('text-gray-1');

    const spanSelectingPrice = document.getElementById('selecting-price');
    spanSelectingPrice.innerHTML = event.target.textContent.trim();
    spanSelectingPrice.classList.add('text-primary');
    this.getTours();
  }

  selectBestSeller() {
    this.orderType = 15;

    const aBestSeller = document.getElementById('best-seller');
    aBestSeller.classList.add('text-primary');
    aBestSeller.classList.remove('text-gray-1');

    const aTopReviewed = document.getElementById('top-reviewed');
    aTopReviewed.classList.remove('text-primary');
    aTopReviewed.classList.add('text-gray-1');

    const spanSelectingPrice = document.getElementById('selecting-price');
    spanSelectingPrice.innerHTML = 'Price';
    spanSelectingPrice.classList.remove('text-primary');
    spanSelectingPrice.classList.add('text-gray-1');
    this.getTours();
  }

  selectTopReviewed() {
    this.orderType = 13;

    const aBestSeller = document.getElementById('best-seller');
    aBestSeller.classList.remove('text-primary');
    aBestSeller.classList.add('text-gray-1');

    const spanSelectingPrice = document.getElementById('selecting-price');
    spanSelectingPrice.innerHTML = 'Price';
    spanSelectingPrice.classList.remove('text-primary');
    spanSelectingPrice.classList.add('text-gray-1');

    const aTopReviewed = document.getElementById('top-reviewed');
    aTopReviewed.classList.add('text-primary');
    aTopReviewed.classList.remove('text-gray-1');
    this.getTours();
  }

  countries: Country[] = [];
  country_id: any = '';
  getCountries() {
    this.MasterDataService.getCountries().subscribe(
      (result) => {
        this.countries = result.data.countries;
        console.log(this.country_id);
        console.log(this.countries);
        this.selectCountry(null, this.countries.filter(country => country.country_id === this.country_id)[0]);
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
    this.MasterDataService.getCities(this.country_id).subscribe(
      (result) => {
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

  //PAGINATION
  currentPage(data: any) {
    this.spinner.show();
    this.getTours(data);
  }

  //TRANSLATE
  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }

  // update() {
  //   this.modalConfirmUpdate.hide();
  //   this.spinner.show();
  //   this.termsOfUseService.updateTermsOfUse({'content_en': this.data}).subscribe(
  //     result => {
  //       this.spinner.hide();
  //       this.dialog.show(this.msgUpdateTermsOfUseSuccess, 'success');
  //     }, (error) => {
  //       this.spinner.hide();
  //       this.dialog.show(this.msgUpdateTermsOfUseFail, 'error');
  //     });
  // }

  // public onEditorChange( event: any) {
  //   this.dataChange = event.editor.getData();
  // }

  // openModalConfirmUpdate() {
  //   this.data = this.dataChange;
  //   if (!this.data || this.data === '') {
  //     this.dialog.show(this.msgDataRequired, 'error');
  //   } else {
  //     this.modalConfirmUpdate.show();
  //   }
  // }
}

