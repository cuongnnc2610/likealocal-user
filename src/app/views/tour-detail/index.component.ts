import {Component, OnInit, ViewChild} from '@angular/core';
import {TourService, ToursReviewService} from '../../_services';
import {DialogComponent} from '../../components';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime, Tour, ToursReview, ToursSchedule } from '../../_models';
import { ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-terms-of-use',
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
  @ViewChild('.dropdown-menu > li') listItems: ElementRef;

  Math = Math;
  Number = Number;

  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  

  constructor(
    public TourService: TourService,
    public ToursReviewService: ToursReviewService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private datePipe : DatePipe
  ) {}
  

  ngOnInit(): void {
    console.log(this.tour);
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.tourId = Number.parseInt(params['id']);
      this.getTour();
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
  tourId: number;
  tour: Tour = new Tour();
  getTour() {
    this.TourService.getTour(this.tourId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.tour = result.data;
          this.tour.toursHosts.forEach(toursHost => {
            toursHost.host.languages = toursHost.host.usersLanguages.map(userLanguage => userLanguage.language.name).sort().join(', ');
          });
          this.isLoaded = true;
          this.spinner.hide();
          this.getToursReviews();
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
    this.getToursReviews(data);
  }

  toursReviews: ToursReview[] = [];
  getToursReviews(numberPage: number = 1) {
    this.ToursReviewService.getToursReviews(numberPage, this.tourId, 1).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          result = result.data;
          this.toursReviews = result.data;
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
  createToursReview() {
    this.isSubmitted = true;
    if (this.rating === 0 || this.content === undefined || this.content === "") {
      return;
    }
    console.log(this.content);
    this.ToursReviewService.createToursReview(this.tour.tour_id, this.rating, this.content).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.getToursReviews();
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

  isToursHostsShown: boolean = false;
  showAllToursHosts() {
    this.isTimesShown = false;
    this.isToursHostsShown = !this.isToursHostsShown;
  }

  isTimesShown: boolean = false;
  showAllTimes() {
    this.isToursHostsShown = false;
    this.isTimesShown = !this.isTimesShown;
  }

  availableDateTimes: DateTime[] = [];
  toursSchedule: ToursSchedule = new ToursSchedule();
  toursHostId: number;
  selectToursHost(event: any, toursHost: any) {
    // var target = event.target || event.srcElement || event.currentTarget;
    // var idAttr = target.attributes.id;
    // var idValue = event.srcElement.attributes.id || event.currentTarget.id;
    this.toursHostId = toursHost.tours_host_id;
    const span = document.getElementById('selecting-tours-host');
    const selectingElement = document.getElementById('toursHost' + this.toursHostId);
    span.innerHTML= '';
    const returnedTarget = selectingElement.cloneNode(true);
    span.appendChild(returnedTarget);

    // SET AVAILABLE DATES
    this.availableDateTimes = [];
    this.toursSchedule = this.tour.toursHosts.filter(toursHost => toursHost.tours_host_id === this.toursHostId)[0].toursSchedule;
    if (!this.toursSchedule.is_recurring) {
      this.toursSchedule.included_datetimes.forEach(datetime => this.availableDateTimes.push(datetime));
    }
    console.log(this.availableDateTimes);
  }

  time: string;
  selectTime(event: any, time: any) {
    this.time = time;
    const span = document.getElementById('selecting-time');
    const selectingElement = document.getElementById('time' + time);
    span.innerHTML= '';
    const returnedTarget = selectingElement.cloneNode(true);
    span.appendChild(returnedTarget);
  }

  numberOfPeople = 0;

  handleMinus() {
    if (this.numberOfPeople !== 0) {
      this.numberOfPeople--;
    }
  }
  handlePlus() {
    if (this.numberOfPeople !== this.tour.max_people) {
      this.numberOfPeople++;
    }  
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = this.availableDateTimes.find(availableDate => availableDate.date === this.datePipe.transform(cellDate, 'yyyy-MM-dd'));
      return date && date.date >= this.datePipe.transform(new Date(), 'yyyy-MM-dd') ? 'example-custom-date-class' : '';
      // const date = cellDate.getDate();
      // return (date === 1 || date === 20) ? 'example-custom-date-class' : '';
    }
    return '';
  }

  myFilter = (d: Date | null): boolean => {
    const selectingDate = this.datePipe.transform(d, 'yyyy-MM-dd');
    const date = this.availableDateTimes.find(availableDate => availableDate.date === selectingDate);
    return date && date.date >= this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // const day = (d || new Date()).getDay();
    // // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
  }

  selectedDate: any;
  times: string[] = [];
  onDate(event): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.times = this.availableDateTimes.filter(datetime => datetime.date === this.selectedDate)[0].time;
  }

}

