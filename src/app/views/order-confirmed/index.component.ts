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
  selector: 'app-order-confirmed',
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

  orderId: number;

  ngOnInit(): void {
    this.spinner.show();
    this.route.queryParams.subscribe(params => {
      this.orderId = Number(params['order_id']);
    });
    this.getOrder();
  }

  isLoaded: boolean = false;
  order: Order = new Order();
  tour: Tour = new Tour();
  host: User = new User();
  getOrder() {
    this.OrderService.getOrder(this.orderId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.order = result.data;
          this.tour = result.data.toursHost.tour;
          this.host = result.data.toursHost.host;
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

