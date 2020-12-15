import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Country, User } from '../../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { UserService, MasterDataService, CategoryService, TransportService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../../components';
import { NgxSpinnerService } from 'ngx-spinner';
import { Language } from '../../../_models/language';

@Component({
  selector: 'app-become-local-expert',
  templateUrl: './become-local-expert.component.html',
  styleUrls: ['./become-local-expert.component.css']
})
export class BecomeLocalExpertComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public formImport: FormGroup;
  public avatarToUpload: File = null;
  public introductionVideoToUpload: File | Blob = null;
  user: User = new User();
  countries: Country[] = [];
  languages: Language[] = [];
  cities = [];

  constructor(
    private UserService: UserService,
    private MasterDataService: MasterDataService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    this.countries = JSON.parse(localStorage.getItem('countries'));
    this.languages = JSON.parse(localStorage.getItem('languages'));
  }

  selectedItems = [];
  dropdownSettings = {};

  ngOnInit(): void {
    this.getProfile();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'language_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      limitSelection: 5
    };

    this.translateLang();
  }  

  getProfile(){
    this.spinner.show();
    this.UserService.getProfile()
    .subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.user = result.data;
        this.setUserInputForm();
        this.getCities();

        if (this.user.introduction_video) {
          this.introductionVideoToUpload = new Blob();
        }
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  isUserSubmitted: boolean = false;
  requestToBeHost(){
    if (this.userForm.invalid || this.introductionVideoToUpload == null) {
      this.isUserSubmitted = true;
      return;
    }
    this.spinner.show();
    return this.UserService.requestToBeHost(this.userForm.controls, this.introductionVideoToUpload)
    .subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("Your request has been submitted", "success");
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

  cityId: number;
  getCities() {
    this.MasterDataService.getCities(this.userForm.controls.country_id.value).subscribe(
      (result) => {
        this.spinner.hide();
        this.cities = result.data.cities;

        if (!this.cities.length) {
          this.userForm.get('city_id').disable();
          this.cityId = null;
          return;
        }
        this.userForm.get('city_id').enable();
        this.cityId = this.cities[0].city_id;
        this.userForm.setValue({
          user_name: this.userForm.controls.user_name.value,
          phone_number: this.userForm.controls.phone_number.value,
          self_introduction: this.userForm.controls.self_introduction.value,
          country_id: this.userForm.controls.country_id.value,
          city_id: this.userForm.controls.city_id.value ? this.userForm.controls.city_id.value : this.cities[0].city_id,
          languages: this.userForm.controls.languages.value,
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  uploadAvatar(files: FileList) {
    this.avatarToUpload = files.item(0);
    this.user.avatar = 'https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif';
    this.UserService.uploadAvatar(this.avatarToUpload).subscribe(
      (result) => {
        this.user.avatar = result.data.avatar;
        localStorage.setItem('userInfo', JSON.stringify(this.user));
      },
      (error) => {
        console.log(error);
      });
  }

  url;
  showIntroductionVideo(files: FileList) {
    this.introductionVideoToUpload =  files.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(this.introductionVideoToUpload);
    reader.onload = (event) => {
      this.url = (<FileReader>event.target).result;
    }
  }


  // USER FORM
  form = new FormGroup({
    user_name: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
      Validators.pattern("[a-zA-Z0-9 ]*"),
    ]),
    phone_number: new FormControl("", [
      Validators.required,
      Validators.maxLength(11),
      Validators.pattern("[0-9]*"),
    ]),
    self_introduction: new FormControl("", [
      Validators.required,
    ]),
    country_id: new FormControl("", [
      Validators.required,
    ]),
    city_id: new FormControl("", [
      Validators.required,
    ]),
    languages: new FormControl("", [
      Validators.required,
    ]),
  });
  userForm = this.form;
  setUserInputForm() {
    this.userForm.setValue({
      user_name: this.user.user_name,
      phone_number: this.user.phone_number,
      self_introduction: this.user.self_introduction,
      country_id: this.user.city ? this.user.city.country_id : this.countries[0].country_id,
      city_id: this.user.city_id ? this.user.city_id : '',
      languages: this.user.usersLanguages.map(usersLanguage => usersLanguage.language),
    });
    this.selectedItems = this.user.usersLanguages.map(usersLanguage => usersLanguage.language)
  }

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}
