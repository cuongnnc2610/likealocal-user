import {Component, OnDestroy, ViewChild, ElementRef, OnInit} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User, ToursImage } from '../../../_models';
import { FormGroup } from '@angular/forms';
import { DialogComponent } from '../../../components';
import { ActivatedRoute } from '@angular/router';
import { TourService, ToursImageService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tour } from '../../../_models/tour';

@Component({
  templateUrl: 'detail.component.html',
  styleUrls:['detail.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class DetailComponent implements OnInit  {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild("labelImport") labelImport: ElementRef;

  public tour_id: number;
  public formImport: FormGroup;
  public fileToUpload: File = null;

  constructor(
    private route: ActivatedRoute,
    private TourService: TourService,
    private ToursImageService: ToursImageService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.tour_id = params['tour_id'];
    });
  }

  ngOnInit(): void {
    this.tour = new Tour();
    this.getTour();
    this.getAllToursImages();
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

  tour: Tour;
  getTour() {
    this.spinner.show();
    this.TourService.getTour(this.tour_id).subscribe(
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

  updateStatusOfTour(tour: any){
    this.spinner.show();
    this.TourService.updateStatusOfTour(tour)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("The tour status has been updated", "success");
          this.tour.status = this.tour.new_status;
          // this.getTour();
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

  toursImages: ToursImage[] = [];
  getAllToursImages() {
    this.ToursImageService.getAllToursImages(this.tour_id).subscribe(
      (result) => {
        console.log(result);
        this.toursImages = result.data.sort((toursImage1, toursImage2) => toursImage1.status - toursImage2.status);
      },
      (error) => {
        // this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  imagePath: any;
  getImage(imagePath) {
    this.imagePath = imagePath;
  }

  updateStatusOfToursImage(toursImage, status) {
    // this.ToursImageService.updateStatusOfToursImage(toursImage, status).subscribe(
    //   (result) => {
    //     console.log(result);
    //     // this.getAllToursImages();
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //     this.dialog.show(error, 'error');
    //   }
    // );
  }
}
