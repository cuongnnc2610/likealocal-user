import {Component, OnInit, ViewChild} from '@angular/core';
import {TourService, ToursReviewService, ToursScheduleService, ToursHostService} from '../../_services';
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
import { MatInput } from '@angular/material/input';


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
    public ToursReviewService: ToursReviewService,
    public ToursScheduleService: ToursScheduleService,
    public ToursHostService: ToursHostService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private datePipe : DatePipe
  ) {}
  

  currentUser: any;
  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.tourId = Number.parseInt(params['id']);
      this.getTour();
    });
    this.currentUser = JSON.parse(localStorage.getItem('userInfo'));

    if (this.currentUser.level_id === 3) {
      this.checkIfHostRequestedToHost();
    }
    
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
          this.tour.toursHosts = this.tour.toursHosts.filter(toursHost => toursHost.is_agreed === true);
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
    this.ToursReviewService.getToursReviews(numberPage, this.tourId, 2).subscribe(
      (result) => {
        this.spinner.hide();
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
    this.spinner.show();
    this.ToursReviewService.createToursReview(this.tour.tour_id, this.rating, this.content).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show('Your review has been submitted', 'success');
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

  includedDatetimes: DateTime[] = [];
  excludedDatetimes: DateTime[] = [];
  toursSchedule: ToursSchedule = new ToursSchedule();
  toursHostId: number;
  selectToursHost(event: any, toursHost: any) {
    // var target = event.target || event.srcElement || event.currentTarget;
    // var idAttr = target.attributes.id;
    // var idValue = event.srcElement.attributes.id || event.currentTarget.id;
    this.toursHostId = toursHost.tours_host_id;

    /* SET CONTENT FOR SELECT */
    const spanSelectingToursHost = document.getElementById('selecting-tours-host');
    const selectingElement = document.getElementById('toursHost' + this.toursHostId);
    spanSelectingToursHost.innerHTML= '';
    const returnedTarget = selectingElement.cloneNode(true);
    spanSelectingToursHost.appendChild(returnedTarget);
    /* SET CONTENT FOR SELECT */

    /* SET AVAILABLE DATES */
    this.includedDatetimes = [];
    this.toursSchedule = this.tour.toursHosts.filter(toursHost => toursHost.tours_host_id === this.toursHostId)[0].toursSchedule;
    if (this.toursSchedule.included_datetimes !== null) {
      this.toursSchedule.included_datetimes.forEach(datetime => this.includedDatetimes.push(datetime));
    }
    if (this.toursSchedule.is_recurring && this.toursSchedule.excluded_datetimes !== null) {
      this.toursSchedule.excluded_datetimes.forEach(datetime => this.excludedDatetimes.push(datetime));
    }
    /* SET AVAILABLE DATES */

    /* RESET SELECTED DATE AND TIME */
    this.inputDate.value = '';

    const spanSelectingTime = document.getElementById('selecting-time');
    spanSelectingTime.innerHTML= 'Choose a time';
    this.times = [];
    this.selectedTime = null;
    /* RESET SELECTED DATE AND TIME */
  }

  selectedTime: string;
  selectTime(event: any, time: any) {
    this.selectedTime = time;
    const span = document.getElementById('selecting-time');
    // const selectingElement = document.getElementById('time' + time);
    span.innerHTML= time;
    // const returnedTarget = selectingElement.cloneNode(true);
    // span.appendChild(returnedTarget);
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

  currentDate = new Date();
  currentFormattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = this.datePipe.transform(cellDate, 'yyyy-MM-dd');
      const includedDatetime = this.includedDatetimes.find(datetime => datetime.date === date);
      const excludedDatetime = this.excludedDatetimes.find(datetime => datetime.date === date);

      let isMarked = false;
      isMarked = this.toursSchedule.recurring_unit === 'DAY'
        || this.toursSchedule.recurring_unit === 'DAYWEEK'
        || (this.toursSchedule.recurring_unit === 'WEEK' && this.toursSchedule.everyweek_recurring_days.findIndex(day => day.weekday === cellDate.getDay()) !== -1)
        || (includedDatetime !== undefined && includedDatetime !== null);
      if (excludedDatetime || cellDate < new Date(new Date().setDate(new Date().getDate() + 3))) {
        isMarked = false;
      }
      return isMarked && !this.toursSchedule.is_blocked ? 'example-custom-date-class' : '';
    }
    return '';
  }

  myFilter = (d: Date | null): boolean => {
    const date = this.datePipe.transform(d, 'yyyy-MM-dd');
    const includedDatetime = this.includedDatetimes.find(datetime => datetime.date === date);
    const excludedDatetime = this.excludedDatetimes.find(datetime => datetime.date === date);

    let isMarked = false;
    isMarked = this.toursSchedule.recurring_unit === 'DAY'
      || this.toursSchedule.recurring_unit === 'DAYWEEK'
      || (this.toursSchedule.recurring_unit === 'WEEK' && this.toursSchedule.everyweek_recurring_days.findIndex(day => day.weekday === d.getDay()) !== -1)
      || (includedDatetime !== undefined && includedDatetime !== null);
    if (excludedDatetime || d < new Date(new Date().setDate(new Date().getDate() + 3))) {
      isMarked = false;
    }
    return isMarked && !this.toursSchedule.is_blocked;
  }

  selectedDate: any;
  times: string[] = [];
  onDate(event): void {
    // RESET SELECTING TIME
    const spanSelectingTime = document.getElementById('selecting-time');
    spanSelectingTime.innerHTML= 'Choose a time';
    this.times = [];
    this.selectedTime = null;

    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.ToursScheduleService.getAvailableSchedulesInDateAndMonth(this.toursHostId, this.selectedDate).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.times = result.data.times_in_date;
        }        
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  navigateToTourBooking() {
    if (!this.toursHostId || !this.selectedDate || !this.selectedTime || !this.numberOfPeople) {
      return;
    }
    this.router.navigate(['/tour-booking'], { queryParams: {
      tours_host_id: this.toursHostId,
      tour_id: this.tourId,
      host_id: this.tour.host.user_id,
      time: this.selectedDate + ' ' + this.selectedTime,
      number_of_people: this.numberOfPeople,
    }});
  }

  isRequestedToHost: boolean = false;
  isAgreed: boolean;
  checkIfHostRequestedToHost() {    
    this.ToursHostService.getAllToursHostsByHost().subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.isRequestedToHost = result.data.findIndex(tour => tour.tour_id === this.tourId) !== -1;
        this.isAgreed = result.data.find(tour => tour.tour_id === this.tourId)?.is_agreed;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  requestGuideTour() {
    this.spinner.show();
    this.ToursHostService.requestGuideTour(this.tourId).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        if (result.code === 20001) {
          if (!this.isRequestedToHost) {
            this.dialog.show('Your request has been submitted', 'success');
          } else {
            this.dialog.show('You are no longer allowed to guide this tour', 'success');
          }
          this.isRequestedToHost = !this.isRequestedToHost;
          this.isAgreed = this.isRequestedToHost ? false : null;
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

}

