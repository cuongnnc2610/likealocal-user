import {Component, OnDestroy, ViewChild, ElementRef, OnInit} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User, ToursImage, Order, DateTime, DayTime, ToursHost } from '../../../_models';
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
  templateUrl: 'my-tour.component.html',
  styleUrls:['my-tour.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class MyTourComponent implements OnInit  {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalToursHosts') modalToursHosts: ModalDirective;
  @ViewChild('modalConfirmRemoveTour') modalConfirmRemoveTour: ModalDirective;
  @ViewChild('modalConfirmAgreeToursHost') modalConfirmAgreeToursHost: ModalDirective;
  @ViewChild('modalConfirmDenyToursHost') modalConfirmDenyToursHost: ModalDirective;

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

  ngOnInit(): void {
    this.spinner.show();
    this.getTours();
    this.translateLang();
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
        this.tours = result.data.filter(tour => tour.host_id === JSON.parse(localStorage.getItem('userInfo')).user_id).sort((tour1, tour2) => tour2.status - tour1.status || tour2.tour_id - tour1.tour_id);
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  tour: Tour = new Tour();
  getTour(tour) {
    this.tour = tour;
  }

  deleteTour() {
    this.spinner.show();
    this.TourService.deleteTour(this.tour).subscribe(
      (result) => {
        this.spinner.hide();
        console.log(result);
        if (result.code === 20001) {
          this.modalConfirmRemoveTour.hide();
          this.dialog.show('The tour has been deleted', 'success');
          this.tours = this.tours.filter(tour => tour.tour_id !== this.tour.tour_id);
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

  showOrHideTour(tour) {
    this.spinner.show();
    this.TourService.showOrHideTour(tour).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        if (result.code === 20001) {
          if (tour.is_shown) {
            this.dialog.show('The tour is being hidden', 'success');
          } else {
            this.dialog.show('The tour is being shown', 'success');
          }
          tour.is_shown = !tour.is_shown;
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

  toursHosts: ToursHost[] = [];
  getToursHosts(tour) {
    this.spinner.show();
    this.ToursHostService.getAllToursHostsByTour(tour.tour_id).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.modalToursHosts.show();
        this.toursHosts = result.data.filter(toursHost => toursHost.host_id !== JSON.parse(localStorage.getItem('userInfo')).user_id).sort((toursHost1, toursHost2) => toursHost1.is_agreed - toursHost2.is_agreed);
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  toursHost: ToursHost;
  getToursHost(toursHost) {
    this.toursHost = toursHost;
  }

  updateAgreeStatusOfToursHost() {
    this.spinner.show();
    this.ToursHostService.updateAgreeStatusOfToursHost(this.toursHost).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.modalConfirmAgreeToursHost.hide();
        if (result.code === 20001) {
          this.dialog.show('The request is agreed', 'success');
          this.toursHost.is_agreed = true;
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

  deleteToursHost() {
    this.spinner.show();
    this.ToursHostService.deleteToursHost(this.toursHost).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.modalConfirmDenyToursHost.hide();
        if (result.code === 20001) {
          this.dialog.show('The request is denied', 'success');
          this.toursHosts = this.toursHosts.filter(toursHost => toursHost.tours_host_id !== this.toursHost.tours_host_id);
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
