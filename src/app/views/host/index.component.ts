import {Component, OnInit, ViewChild} from '@angular/core';
import {TourService, HostsReviewService, UserService} from '../../_services';
import {DialogComponent} from '../../components';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime, Tour, HostsReview, ToursSchedule, User } from '../../_models';
import { ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-host',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild('firstStar') firstStar: ElementRef;
  @ViewChild('secondStar') secondStar: ElementRef;
  @ViewChild('thirdStar') thirdStar: ElementRef;
  @ViewChild('fourthStar') fourthStar: ElementRef;
  @ViewChild('fifthStar') fifthStar: ElementRef;
  @ViewChild('inputDate', { read: MatInput}) inputDate: MatInput;

  Math = Math;
  Number = Number;

  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  

  constructor(
    public TourService: TourService,
    public HostsReviewService: HostsReviewService,
    public UserService: UserService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private datePipe : DatePipe
  ) {}
  

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.hostId = Number.parseInt(params['id']);
      this.getHost();
      this.getHostsReviewsByHostId();
    });
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

  isLoaded: boolean = false;
  hostId: number;
  host: User = new User();
  tours: Tour[] = [];
  getHost() {
    this.UserService.getHost(this.hostId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.host = result.data.user;
          this.host.languages = this.host.usersLanguages.map(userLanguage => userLanguage.language.name).sort().join(', ');
          this.host.rating = Math.round(this.host.rating);
          this.tours = result.data.tours;
          this.isLoaded = true;
          this.spinner.hide();
        } else {
          this.router.navigateByUrl('/404');
        }
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
    this.getHostsReviewsByHostId(data);
  }

  hostsReviews: HostsReview[] = [];
  getHostsReviewsByHostId(numberPage: number = 1) {
    this.HostsReviewService.getHostsReviewsByHostId(numberPage, this.hostId, 1).subscribe(
      (result) => {
        this.spinner.hide();
        console.log(result);
        if (result.code === 20001) {
          result = result.data;
          this.hostsReviews = result.data;
          this.total = result.total;
          this.pageSize = result.per_page;
          this.from = result.from;
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

  isSubmitted: boolean = false;
  content: string;
  createHostsReview() {
    this.isSubmitted = true;
    if (this.rating === 0 || this.content === undefined || this.content === "") {
      return;
    }
    console.log(this.content);
    this.HostsReviewService.createHostsReview(this.hostId, this.rating, this.content).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.getHostsReviewsByHostId();
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

  rating: number = 0;
  setStarColor(numberOfStars: number) {
    const greenColor = '#b0d12b';
    switch (numberOfStars) {
      case 5:
        this.renderer.setStyle(this.fifthStar.nativeElement, 'color', greenColor);
      case 4:
        this.renderer.setStyle(this.fourthStar.nativeElement, 'color', greenColor);
      case 3:
        this.renderer.setStyle(this.thirdStar.nativeElement, 'color', greenColor);
      case 2:
        this.renderer.setStyle(this.secondStar.nativeElement, 'color', greenColor);
      case 1:
        this.renderer.setStyle(this.firstStar.nativeElement, 'color', greenColor);
      default:
        break;
    }
  }

  removeStarColor() {
    const grayColor ='#3B454F';
    this.renderer.setStyle(this.fifthStar.nativeElement, 'color', grayColor);
    this.renderer.setStyle(this.fourthStar.nativeElement, 'color', grayColor);
    this.renderer.setStyle(this.thirdStar.nativeElement, 'color', grayColor);
    this.renderer.setStyle(this.secondStar.nativeElement, 'color', grayColor);
    this.renderer.setStyle(this.firstStar.nativeElement, 'color', grayColor);
  }

  imagePath: any;
  getImage(imagePath) {
    this.imagePath = imagePath;
  }
}

