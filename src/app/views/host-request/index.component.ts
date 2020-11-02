import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { HostRequestService, MasterDataService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-host-request',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalEditHost') modalEditHost: ModalDirective;
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
    private HostRequestService: HostRequestService,
    private MasterDataService: MasterDataService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.users = [];
    this.user = new User();
    this.getCountries();
    this.getHostRequests();
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
    this.getHostRequests(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  requestStatusSearchOptions = [{value: "", name: "All"}, {value: 2, name: "Pending"}, {value: 1, name: "Rejected"}];
  getHostRequests(numberPage: number = 1) {    
    this.HostRequestService.getHostRequests(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
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
  }

  approveOrRejectHostRequest(request_status: number){
    this.spinner.show();
    this.HostRequestService.approveOrRejectHostRequest(this.user.user_id, request_status)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalEditHost.hide();
          if (request_status === 0) {
            this.dialog.show("The request has been approved", "success");
          } else {
            this.dialog.show("The request has been rejected", "success");
          }
          this.getHostRequests(this.page);
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

  // SEARCH FORM
  searchForm = new FormGroup({
    user_name: new FormControl("", []),
    email: new FormControl("", []),
    country_id: new FormControl("", []),
    city_id: new FormControl("", []),
    updated_at: new FormControl("", []),
    request_status: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      user_name: '',
      email: '',
      country_id: this.countries[0].country_id,
      city_id: '',
      updated_at: '',
      request_status: '',
    });
  }
}
