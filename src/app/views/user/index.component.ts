import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { UserService, MasterDataService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalAddUser') modalAddUser: ModalDirective;
  @ViewChild('modalEditUser') modalEditUser: ModalDirective;
  @ViewChild('modalConfirmRemoveUser') modalConfirmRemoveUser: ModalDirective;
  @ViewChild('modalConfirmRemoveAvatar') modalConfirmRemoveAvatar: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public users: User[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private UserService: UserService,
    private MasterDataService: MasterDataService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.users = [];
    this.user = new User();
    this.hostTypeOptions = [];
    this.getCountries();
    this.getUsers();
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
    this.getUsers(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  // DEFINE ALL SELECT OPTIONS
  levelSearchOptions = [{value: "", name: "All"}, {value: 2, name: "User"}, {value: 3, name: "Host"}];
  levelOptions = [{value: 2, name: "User"}, {value: 3, name: "Host"}];
  isTourGuideOptions = [{value: "", name: "All"}, {value: true, name: "Tour guide"}, {value: false, name: "Local"}];
  hostTypeOptions = this.isTourGuideOptions;
  isVerifiedOptions = [{value: "", name: "All"}, {value: true, name: "Verified"}, {value: false, name: "Unverified"}];
  updateEnablingStatusOfHostType() {
    if (this.searchInputForm.controls.level_id.value === '' || this.searchInputForm.controls.level_id.value === '2') {
      this.hostTypeOptions = [];
      this.searchInputForm.get('is_tour_guide').disable();
      return;
    }
    this.hostTypeOptions = this.isTourGuideOptions;
    this.searchInputForm.setValue({
      user_name: this.searchInputForm.controls.user_name.value,
      email: this.searchInputForm.controls.email.value,
      country_id: this.searchInputForm.controls.country_id.value,
      city_id: this.searchInputForm.controls.city_id.value,
      level_id: this.searchInputForm.controls.level_id.value,
      is_tour_guide: this.isTourGuideOptions[0].value,
      date: this.searchInputForm.controls.date.value,
      is_verified: this.searchInputForm.controls.is_verified.value,
    });
    this.searchInputForm.get('is_tour_guide').enable();
  }

  getUsers(numberPage: number = 1) {    
    this.UserService.getUsers(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        console.log(result);
        result = result.data;
        this.spinner.hide();
        this.users = result.data;
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

  user: User;
  getUser(user: any) {
    this.user = user;
    let languages = '';
    for (let index = 0; index < user.usersLanguages.length; index++) {
      if (index === user.usersLanguages.length - 1 ) {
        languages += user.usersLanguages[index].language.name;
      }
      else {
        languages += user.usersLanguages[index].language.name + ', ';
      }
    }
    this.user.languages = languages;
    
    // SET SRC VIDEO    
    const videoFrame = document.getElementById('video-frame');
    if (document.contains(document.getElementById('introduction-video'))) {
      document.getElementById('introduction-video').remove();
    }
    if (this.user.introduction_video) {
      const video = document.createElement('video');
      video.setAttribute('id', 'introduction-video');
      video.setAttribute('width', '100%');
      video.setAttribute('height', '100%');
      video.setAttribute('controls', 'controls');
      video.setAttribute('preload', 'auto');
      videoFrame.appendChild(video);
      const source = document.createElement('source');
      source.setAttribute('id', 'source-video');
      source.setAttribute('src', this.user.introduction_video);
      video.appendChild(source);
    }

    this.editUserForm.setValue({
      level_id: user.level_id,
      phone_number: user.phone_number,
      avatar: user.avatar,
      city_id: user.city_id,
      users_languages: user.usersLanguages,
    });
  }

  deleteUser() {
    this.spinner.show();
    this.UserService.deleteUser(this.user.user_id).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveUser.hide();
          this.dialog.show("The user has been deleted", "success");
          this.getUsers(this.page);
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

  createUser(){
    if (this.addUserForm.invalid) {
      this.isAddUserSubmitted = true;
      return;
    }
    const newUser = this.addUserForm.value;
    this.spinner.show();
    this.UserService.createUser(newUser)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalAddUser.hide();
          this.dialog.show("The users has been added", "success");
          this.getUsers(this.page);
          this.clearAddUserForm();
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

  editUser(){
    if (this.editUserForm.invalid) {
      this.isEditUserSubmitted = true;
      return;
    }
    const user = this.editUserForm.value;
    user.user_id = this.user.user_id;
    this.spinner.show();
    // this.UserService.updateUser(user)
    // .subscribe(
    //   (result) => {
    //     this.spinner.hide();
    //     if (result.code === 20001) {
    //       this.modalEditUser.hide();
    //       this.dialog.show("The user has been edited", "success");
    //       this.getUsers(this.page);
    //       this.clearEditUserForm();
    //     } else {
    //       this.dialog.show(result.message, 'error');
    //     }
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //     this.dialog.show(error, 'error');
    //   }
    // );
  }

  removeAvatar() {
    this.spinner.show();
    this.UserService.removeAvatar(this.user.user_id).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.user.avatar = result.data.avatar;
          this.modalConfirmRemoveAvatar.hide();
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
  isAddUserSubmitted: boolean = false;
  isEditUserSubmitted: boolean = false;
  addUserForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
      Validators.email,
    ]),
    user_name: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
      Validators.pattern("[a-zA-Z ]*"),
    ]),
    level_id: new FormControl("2", [Validators.required]),
    password: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });
  editUserForm = new FormGroup({
    level_id: new FormControl("2", [Validators.required]),
    phone_number: new FormControl("", [
      Validators.required,
      Validators.maxLength(11),
      Validators.pattern("[0-9]*"),
    ]),
    avatar: new FormControl("", [
      Validators.required,
    ]),
    city_id: new FormControl("", [Validators.required]),
    users_languages: new FormControl("", [
      Validators.required,
    ]),
  });
  clearAddUserForm() {
    this.addUserForm.reset();
    this.addUserForm.setValue({
      email: '',
      user_name: '',
      level_id: '2',
      password: '',
    });
    this.isAddUserSubmitted = false;
  }
  clearEditUserForm() {
    this.editUserForm.reset();
    this.editUserForm.setValue({
      level_id: this.levelOptions[1].value,
      phone_number: '',
      avatar: '',
      city_id: '',
      users_languages: '',
    });
    this.isEditUserSubmitted = false;
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

  // SEARCH FORM
  searchForm = new FormGroup({
    user_name: new FormControl("", []),
    email: new FormControl("", []),
    country_id: new FormControl("", []),
    city_id: new FormControl("", []),
    level_id: new FormControl(this.levelSearchOptions[0].value, []),
    is_tour_guide: new FormControl(this.isTourGuideOptions[0].value, []),
    created_at: new FormControl("", []),
    is_verified: new FormControl(this.isVerifiedOptions[0].value, []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      user_name: '',
      email: '',
      country_id: this.countries[0].country_id,
      city_id: '',
      level_id: this.levelSearchOptions[0].value,
      is_tour_guide: this.isTourGuideOptions[0].value,
      created_at: '',
      is_verified: this.isVerifiedOptions[0].value,
    });
  }
}
