import {Component, OnDestroy, ViewChild, ElementRef, OnInit} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User, ToursEdit } from '../../../_models';
import { FormGroup } from '@angular/forms';
import { DialogComponent } from '../../../components';
import { ActivatedRoute, Router } from '@angular/router';
import { ToursEditService } from '../../../_services';
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

  public tours_edit_id: number;
  public formImport: FormGroup;
  public fileToUpload: File = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ToursEditService: ToursEditService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.tours_edit_id = params['tours_edit_id'];
    });
  }

  ngOnInit(): void {
    this.toursEdit = new ToursEdit();
    this.tour = new Tour();
    this.getToursEdit();
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

  toursEdit: ToursEdit;
  tour: Tour;
  getToursEdit() {
    this.spinner.show();
    this.ToursEditService.getToursEdit(this.tours_edit_id).subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        this.toursEdit = result.data.tours_edit;
        this.tour = result.data.tour;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  approveToursEdit(toursEdit: any){
    this.spinner.show();
    this.ToursEditService.approveToursEdit(toursEdit)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("The tour edit request has been approved", "success");
          this.toursEdit.status = 2;
          const routerlink = this.router;
          setTimeout(function(){
            routerlink.navigate(['/tours-edit']);
          }, 2000);
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

  rejectToursEdit(toursEdit: any){
    this.spinner.show();
    this.ToursEditService.rejectToursEdit(toursEdit)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("The tour edit request has been rejected", "success");
          this.toursEdit.status = 1;
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
