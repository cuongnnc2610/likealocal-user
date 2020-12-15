import {Component, ViewChild} from '@angular/core';
import {navItems} from '../../_nav';
import {Router} from '@angular/router';
import {AuthenticationService, MasterDataService, UserService, CategoryService, TransportService, BenefitService} from '../../_services';
import {User} from '../../_models/user';
import {MultiLanguageService} from '../../_services/multi-language.service';
import { data } from 'jquery';
// import { DialogComponent } from '../../components';
// import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-account-layout',
  templateUrl: './my-account-layout.component.html',
  styleUrls: ['./my-account-layout.component.css']
})
export class MyAccountLayoutComponent {
  // @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public sidebarMinimized = false;
  public navItems = navItems;
  public currentUser: User;

  constructor(
    private router: Router,
    private AuthenticationService: AuthenticationService,
    public MasterDataService: MasterDataService,
    public UserService: UserService,
    public CategoryService: CategoryService,
    public TransportService: TransportService,
    public BenefitService: BenefitService,
    public multiLanguageService: MultiLanguageService,
  ) {
    // this.AuthenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log();
  }

  payload: any;
  ngOnInit(): void {
    if (this.currentUser) {
      this.payload = JSON.parse(atob(this.currentUser.token.split('.')[1])).payload;
    }
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.getProfile();
    this.getLanguages();
    this.getCategories();
    this.getTransports();
    this.getBenefits();
  }

  user: User = new User();
  getProfile(){
    this.UserService.getProfile()
    .subscribe(
      (result) => {
        this.user = result.data;
      },
      (error) => {
        console.log(error);
      }
    );
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

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.AuthenticationService.logout();
    window.location.reload();
  }

  switchLang() {
    this.multiLanguageService.switchLang();
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

  getLanguages() {
    this.MasterDataService.getLanguages().subscribe(
      (result) => {
        localStorage.setItem('languages', JSON.stringify(result.data.languages));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCategories() {
    this.CategoryService.getCategories(null, 1).subscribe(
      (result) => {
        localStorage.setItem('categories', JSON.stringify(result.data.categories));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTransports() {
    this.TransportService.getTransports(null, 1).subscribe(
      (result) => {
        localStorage.setItem('transports', JSON.stringify(result.data.transports));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getBenefits() {
    this.BenefitService.getBenefits(null, 1).subscribe(
      (result) => {
        localStorage.setItem('benefits', JSON.stringify(result.data.benefits.map(({toursBenefits, ...benefit}) => benefit)));
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
