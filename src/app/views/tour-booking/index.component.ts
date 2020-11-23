import {Component, OnInit, ViewChild} from '@angular/core';
import { TourService, CouponService, OrderService, MasterDataService} from '../../_services';
import {DialogComponent} from '../../components';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Coupon, Order, Tour, User } from '../../_models';
import { Language } from '../../_models/language';

@Component({
  selector: 'app-tour-booking',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild('modalConfirmUpdate') modalConfirmUpdate: ModalDirective;

  Math = Math;
  Number = Number;

  constructor(
    public TourService: TourService,
    public CouponService: CouponService,
    public OrderService: OrderService,
    public MasterDataService: MasterDataService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  tourId: number;
  time: string;

  ngOnInit(): void {
    this.spinner.show();
    this.route.queryParams.subscribe(params => {
      this.order.tours_host_id = Number(params['tours_host_id']);
      this.tourId = Number(params['tour_id']);
      this.time = params['time'];
      this.order.date_time = params['time'].replace(' ', 'T') + ':00.000+00:00';
      this.order.number_of_people = Number(params['number_of_people']);
    });
    this.getTour();
    this.getLanguages();
  }

  isLoaded: boolean = false;
  tour: Tour = new Tour();
  host: User = new User();
  getTour() {
    this.TourService.getTour(this.tourId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.tour = result.data;
          this.host = this.tour.toursHosts.filter(toursHost => toursHost.tours_host_id === this.order.tours_host_id)[0].host;
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

  code: string;
  coupon: Coupon = null;
  errorCoupon: boolean = false;
  isVerifyCouponCalling: boolean = false;
  verifyCoupon() {
    this.isVerifyCouponCalling = true;
    this.CouponService.verifyCoupon(this.code).subscribe(
      (result) => {
        this.isVerifyCouponCalling = false;
        console.log(result);
        if (result.code === 20001) {
          this.errorCoupon = !result.data.is_available || result.data.used_quantity >= result.data.total_quantity;
          if (!this.errorCoupon) {
            this.order.coupon = result.data;
            this.coupon = result.data;
          }
        } else {
          this.coupon = null;
          this.errorCoupon = true;
        }
        
      },
      (error) => {
        this.isVerifyCouponCalling = false;
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  order: Order = new Order();
  createOrder() {
    console.log(this.order);
    this.OrderService.createOrder(this.order).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.router.navigate(['/order-confirmed'], { queryParams: {
            order_id: result.data.order_id,
          }});
        } else {
          this.spinner.hide();
          this.dialog.show(result.message, 'error');
        }
      },
      (error) => {
        this.isVerifyCouponCalling = false;
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  isLanguagesShown: boolean = false;
  showAllLanguages() {
    this.isLanguagesShown = !this.isLanguagesShown;
  }

  selectLanguage(language: any) {
    this.order.language_id = language.language_id;
    const span = document.getElementById('selecting-language-id');
    span.innerHTML= language.name;
  }

  languages: Language[] = [];
  getLanguages() {
    this.MasterDataService.getLanguages().subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.languages = result.data.languages;
        }
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
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
}

