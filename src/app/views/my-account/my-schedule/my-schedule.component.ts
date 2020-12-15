import {Component, OnDestroy, ViewChild, ElementRef, OnInit} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User, ToursImage, Order, DateTime, DayTime } from '../../../_models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../../components';
import { ActivatedRoute } from '@angular/router';
import { ToursHostService, TourService, ToursScheduleService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tour } from '../../../_models/tour';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'my-schedule.component.html',
  styleUrls:['my-schedule.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class MyScheduleComponent implements OnInit  {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalConfirmRemoveToursHost') modalConfirmRemoveToursHost: ModalDirective;
  @ViewChild('modalEditSchedule') modalEditSchedule: ModalDirective;

  Math = Math;
  Number = Number;

  public orders: Order[] = [];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  

  constructor(
    private route: ActivatedRoute,
    private ToursHostService: ToursHostService,
    private TourService: TourService,
    private ToursScheduleService: ToursScheduleService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private datePipe : DatePipe
  ) {
  }

  selectedTimes = [];
  everydayTimesSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 7,
    allowSearchFilter: true,
    limitSelection: -1
  };
  timesOfWeekdaySettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection: -1
  };
  weekdaySettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    limitSelection: 1
  };

  ngOnInit(): void {
    this.spinner.show();
    this.getTours();
    this.translateLang();
    
    this.initialAllTimeDropdownsValue();
  }

  //PAGINATION
  // currentPage(data: any) {
  //   this.spinner.show();
  //   this.getOrders(data);
  // }

  // orderType: number = 1;
  // changeOrderType(orderType: any) {
  //   if (this.orderType === orderType) {
  //     orderType++;
  //   }
  //   this.orderType = orderType;
  //   this.currentPage(1);
  // }

  tours: Tour[] = [];
  getTours() {    
    this.ToursHostService.getAllToursHostsByHost().subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.tours = result.data.filter(tour => tour.is_agreed === true).sort((tour1, tour2) => tour2.status - tour1.status);
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  tour: Tour = new Tour();
  getTour() {
    this.spinner.show();
    this.TourService.getTour(this.tour.tour_id).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.tour = result.data;
        this.tour.rating = Math.floor(this.tour.rating);
        const hostLanguages = [];
        for (let index = 0; index < this.tour.host.usersLanguages.length; index++) {
          hostLanguages.push(this.tour.host.usersLanguages[index].language.name);
        }
        this.tour.host.languages = hostLanguages.sort().join(', ');
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  toursHost: any = null;

  isEveryday: boolean;
  isEveryweek: boolean;
  getToursHost(tour: any) {
    this.toursHost = tour;
    this.isCalendarReLoaded = true;
    console.log(this.toursHost.tours_schedule);

    this.isEveryday = this.toursHost.tours_schedule.recurring_unit === 'DAY' || this.toursHost.tours_schedule.recurring_unit === 'DAYWEEK';
    this.isEveryweek = this.toursHost.tours_schedule.recurring_unit === 'WEEK' || this.toursHost.tours_schedule.recurring_unit === 'DAYWEEK';

    this.everyweekRecurringDays = this.toursHost.tours_schedule.everyweek_recurring_days;

    // SET everyday_recurring_hours
    this.selectedTimes = [];
    if (this.toursHost.tours_schedule.everyday_recurring_hours) {
      this.toursHost.tours_schedule.everyday_recurring_hours.forEach(hour => {
        this.selectedTimes.push({
          id: hour,
          name: hour,
        });
      });
    }

    this.includedDatetimes = this.toursHost.tours_schedule.included_datetimes;
    this.excludedDatetimes = this.toursHost.tours_schedule.excluded_datetimes;
  }

  currentMonth;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (this.toursHost) {
      this.currentMonth = JSON.parse(JSON.stringify(cellDate));
      
      // Only highligh dates inside the month view.
      if (view === 'month') {
        const date = this.datePipe.transform(cellDate, 'yyyy-MM-dd');
        const includedDatetime = this.includedDatetimes?.find(datetime => datetime.date === date);
        const excludedDatetime = this.excludedDatetimes?.find(datetime => datetime.date === date);

        let isMarked = false;
        isMarked = this.isEveryday && this.selectedTimes.length > 0
          // || this.toursHost.tours_schedule.recurring_unit === 'DAYWEEK'
          || (this.isEveryweek && this.everyweekRecurringDays.length > 0 && this.everyweekRecurringDays.findIndex(day => day.weekday === cellDate.getDay()) !== -1)
          || (includedDatetime !== undefined && includedDatetime !== null);
        if (excludedDatetime || cellDate < new Date(new Date().setDate(new Date().getDate() + 3))) {
          isMarked = false;
        }
        return isMarked && !this.toursHost.tours_schedule.is_blocked ? 'example-custom-date-class' : '';
      }
    }
    return '';
  }
  
  temp;
  selectedMonth;
  isCalendarReLoaded: boolean = true;
  reloadCalendar() {
    this.isCalendarReLoaded = !this.isCalendarReLoaded;
  }
  waitToReloadCalendar() {
    setTimeout(()=> {
      this.selectedMonth = JSON.parse(JSON.stringify(this.currentMonth));
      this.reloadCalendar();
    }, 0);
  }

  onDateSelected(event) {
    console.log(event);
  }



  includedDatetimes: DateTime[] = [];
  excludedDatetimes: DateTime[] = [];
  // everyweekRecurringDays: DayTime[] = [];
  everyweekRecurringDays: any[] = [];
  everydayRecurringHours: string[] = [];
  recurringUnit: string;
  isRecurring: boolean;

  showAllWeekDays(day) {
    const ul = document.getElementById('dropdown-weekday-' + day.weekday);
    ul.classList.toggle("ae-hide")
  }

  selectWeekday(event: any, day, weekday: any) {
    if (this.everyweekRecurringDays.filter(x => x.weekday === weekday.id && day.weekday !== weekday.id).length) {
      this.dialog.show(weekday.name + ' is exists in your everyweek days', 'error');
      return;
    }
    
    const span = document.getElementById('selecting-weekday-' + day.weekday);
    span.innerHTML= weekday.name;

    this.everyweekRecurringDays.find(x => x.weekday === day.weekday).weekday = weekday.id;
    console.log(this.everyweekRecurringDays);
  }

  removeWeekday(day) {
    this.everyweekRecurringDays = this.everyweekRecurringDays.filter(recurringDay => recurringDay.weekday !== day.weekday);
  }

  weekdayIndex = -1;
  addWeekday() {
    if (this.everyweekRecurringDays.length < 7) {
      this.everyweekRecurringDays.push({
        weekday: this.weekdayIndex--,
        time: [],
      });
    }
  }

  removeIncludedDate(day) {
    this.includedDatetimes = this.includedDatetimes.filter(includedDate => includedDate.date !== day.date);
  }

  addIncludedDate() {
    this.includedDatetimes.push({
      date: '',
      time: [],
    });
  }

  weekdays = [];
  times = [];
  nameOfWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  initialAllTimeDropdownsValue() {
    for (let hour = 0; hour <= 23.5; hour+= 0.5) {
      let time = (hour < 10 ? '0' + Math.floor(hour) : Math.floor(hour)) + ":" + (hour !== Math.floor(hour) ? '30' : '00');
      this.times.push({
        id: time,
        name: time,
      })
    }
    
    for (let index = 0; index < this.nameOfWeekdays.length; index++) {
      this.weekdays.push({
        id: index,
        name: this.nameOfWeekdays[index]
      });
    }
  }

  deleteToursHost() {
    console.log(this.toursHost.tours_host_id);
  }

  updateToursSchedule(){
    this.spinner.show();
    this.isRecurring = this.isEveryday || this.isEveryweek;
    this.recurringUnit = (this.isEveryday ? 'DAY' : '') + (this.isEveryweek ? 'WEEK' : '');
    this.everydayRecurringHours = this.selectedTimes.map(selectedTime => selectedTime.name).sort((a, b) => a.localeCompare(b));
    this.everyweekRecurringDays = this.everyweekRecurringDays.filter(day => day.weekday >= 0 && day.time.length > 0);
    this.everyweekRecurringDays.forEach(everyweekRecurringDay => {
      if (everyweekRecurringDay.time[0].id !== undefined) {
        everyweekRecurringDay.time = everyweekRecurringDay.time.map(time => time.id);
      }
    });

    console.log('isRecurring: ', this.isRecurring);
    console.log('recurringUnit: ', this.recurringUnit);
    console.log('everydayRecurringHours: ', this.everydayRecurringHours);
    console.log('everyweekRecurringDays: ', this.everyweekRecurringDays);
    console.log('includedDatetimes: ', this.includedDatetimes);
    console.log('excludedDatetimes: ', this.excludedDatetimes);
    
    this.ToursScheduleService.updateToursSchedule(this.toursHost.tours_host_id, this.includedDatetimes, this.excludedDatetimes, this.everyweekRecurringDays, this.everydayRecurringHours, this.recurringUnit, this.isRecurring)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("The schedule has been updated", "success");
          this.getTours();
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

  translateLang() {
    this.translate.addLangs(['en', 'vn']);
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}
