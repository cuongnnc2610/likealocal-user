import { Component, OnInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { CategoryService, TourService, MasterDataService, AuthenticationService } from '../../_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DialogComponent } from '../../components';
import { Tour, Category, User, Country } from '../../_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;

  Math = Math;
  Number = Number;
  public currentUser: User;
  countries: Country[] = [];

  constructor(
    private AuthenticationService: AuthenticationService,
    private CategoryService: CategoryService,
    private MasterDataService: MasterDataService,
    private TourService: TourService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {
    // this.AuthenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.countries = JSON.parse(localStorage.getItem('countries'));
  }

  payload: any;
  ngOnInit(): void {
    this.spinner.show();
    if (this.currentUser) {
      this.payload = JSON.parse(atob(this.currentUser.token.split('.')[1])).payload;
    }
    this.getCategories();
    this.getCountriesWithTheMostTours();
  }

  categories: Category[] = [];
  categoriesSearchOptions: Category[] = [];
  getCategories() {
    this.CategoryService.getCategories(null, 1).subscribe(
      (result) => {
        this.categories = result.data.categories;
        this.categoriesSearchOptions = JSON.parse(JSON.stringify(this.categories));

        // Remove 'tour' in name
        this.categories = this.categories.map(category => ({
          ...category,
          name: category.name.replace(' tour', ''),
        }));

        // Add 'All" to search options
        this.categoriesSearchOptions.unshift({
          category_id: 0,
          name: 'All'
        });

        console.log(this.categories);
        console.log(this.categoriesSearchOptions);
        this.getToursByCategory();
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  countriesWithTheMostTours = [];
  getCountriesWithTheMostTours() {
    const numberOfCountries = 6;
    this.MasterDataService.getCountriesWithTheMostTours(numberOfCountries).subscribe(
      (result) => {
        console.log(result);
        this.countriesWithTheMostTours = result.data.countries;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  toursByCategory = [];
  getToursByCategory() {
    this.categories.forEach(category => {
      this.toursByCategory.push({
        category_id: category.category_id,
        name: category.name,
        tours: [],
      });
      this.TourService.getToursByCategory(category.category_id, 8, 15).subscribe(
        (result) => {
          console.log(result);
          this.toursByCategory.find(tourByCategory => tourByCategory.category_id === category.category_id).tours = result.data.data;
        },
        (error) => {
          this.spinner.hide();
          this.dialog.show(error, 'error');
        }
      );
    });
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    start_date: new FormControl("", []),
    end_date: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      start_date: '',
      end_date: '',
    });
  }

  isAccountShown: boolean = false;
  showAccount() {
    this.isAccountShown = !this.isAccountShown;
  }

  loginEmail: string;
  loginPassword: string;
  loginError: boolean = false;
  login() {
    this.AuthenticationService.login(this.loginEmail, this.loginPassword).subscribe(
      (result) => {
        console.log(result);
        if (result.code !== 20001) {
          this.loginError = true;
          return;
        }
        window.location.reload();
      },
      (error) => {
        console.log(error, 'error');
        // this.spinner.hide();
        // this.dialog.show(error, 'error');
      }
    );
  }

  logout() {
    this.AuthenticationService.logout();
    window.location.reload();
  }

  toggleSignUpDropdown() {
    const divSignUpDropdown = document.getElementById('signUpDropdown');
    if (divSignUpDropdown.classList.contains('u-unfold--css-animation') && divSignUpDropdown.classList.contains('slideInUp')) {
      divSignUpDropdown.classList.remove('u-unfold--css-animation');
      divSignUpDropdown.classList.remove('slideInUp');
    } else {
      divSignUpDropdown.classList.add('u-unfold--css-animation');
      divSignUpDropdown.classList.add('slideInUp');
    }
  }

  showSignUp() {
    const login = document.getElementById('login');
    const signup = document.getElementById('signup');
    const forgotPassword = document.getElementById('forgotPassword');

    login.style.display = 'none';
    forgotPassword.style.display = 'none';
    signup.style.display = 'block';
  }

  showLogin() {
    const login = document.getElementById('login');
    const signup = document.getElementById('signup');
    const forgotPassword = document.getElementById('forgotPassword');

    signup.style.display = 'none';
    forgotPassword.style.display = 'none';
    login.style.display = 'block';
  }

  showForgotPassword() {
    const login = document.getElementById('login');
    const signup = document.getElementById('signup');
    const forgotPassword = document.getElementById('forgotPassword');

    signup.style.display = 'none';
    login.style.display = 'none';
    forgotPassword.style.display = 'block';
  }

  navigateToMyAccount() {
    this.router.navigate(['/my-account']);
  }
}
