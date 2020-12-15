import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Benefit, Category, Country, Tour, User } from '../../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { TourService, MasterDataService, ToursImageService, ToursEditService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../../components';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrls: ['./edit-tour.component.css']
})
export class EditTourComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public formImport: FormGroup;
  public avatarToUpload: File = null;
  public introductionVideoToUpload: File | Blob = null;
  countries: Country[] = [];
  categories: Category[] = [];
  transports: Transport[] = [];
  benefits: Benefit[] = [];
  cities = [];

  constructor(
    private TourService: TourService,
    private ToursImageService: ToursImageService,
    private ToursEditService: ToursEditService,
    private MasterDataService: MasterDataService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.countries = JSON.parse(localStorage.getItem('countries'));
    this.categories = JSON.parse(localStorage.getItem('categories'));
    this.transports = JSON.parse(localStorage.getItem('transports'));
    this.benefits = JSON.parse(localStorage.getItem('benefits'));

    this.route.params.subscribe(params => {
      this.tourId = Number.parseInt(params['id']);
      this.getTour();
      this.getToursImages();
      this.getLatestToursEditOfTour();
    });
  }

  includedBenefits: any[];
  excludedBenefits: any[];
  isLoaded: boolean = false;
  tourId: number;
  toursPlaceId: number = 0;
  toursImageId: number = 0;
  tour: Tour = new Tour();
  getTour() {
    this.spinner.show();
    this.TourService.getTour(this.tourId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.tour = result.data;
          this.showTourInfo();

          // this.coverImage = this.tour.cover_image;
          // this.coverImageLink = this.tour.cover_image;

          // this.toursPlaces = result.data.toursPlaces;
          // this.toursPlaces = this.toursPlaces.map(({place_name, description}) => ({place_name, description}));
          // this.toursPlaces.forEach(place => place.id = this.toursPlaceId++);

          // this.tourForm.setValue({
          //   name: this.tour.name,
          //   description: this.tour.description,
          //   country_id: this.tour.city.country_id,
          //   city_id: this.tour.city_id,
          //   list_price: this.tour.list_price,
          //   sale_price: this.tour.sale_price,
          //   max_people: this.tour.max_people,
          //   duration: this.tour.duration,
          //   meeting_address: this.tour.meeting_address,
          //   category_id: this.tour.category_id,
          //   transport_id: this.tour.transport_id,
          //   included_benefits: this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included === true).map(toursBenefit => toursBenefit.benefit),
          //   excluded_benefits: this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included !== true).map(toursBenefit => toursBenefit.benefit),
          // });
          // this.includedBenefits = this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included === true).map(toursBenefit => toursBenefit.benefit);
          // this.excludedBenefits = this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included !== true).map(toursBenefit => toursBenefit.benefit);
          // this.getCities();
          this.spinner.hide();
          this.isLoaded = true;
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

  getToursImages() {
    this.ToursImageService.getAllToursImages(this.tourId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.toursImages = result.data;
          this.toursImages.forEach(image => image.id = this.toursImageId++);
        }
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  toursEdit: any = null;
  getLatestToursEditOfTour() {
    this.ToursEditService.getLatestToursEditOfTour(this.tourId).subscribe(
      (result) => {
        console.log(result);
        if (result.code === 20001) {
          this.toursEdit = result.data;
        }
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }


  isShowToursEdit: boolean = false;
  showTourInfo() {
    this.isShowToursEdit = false;
    this.coverImage = this.tour.cover_image;
    this.coverImageLink = this.tour.cover_image;

    this.toursPlaces = this.tour.toursPlaces;
    this.toursPlaces = this.toursPlaces.map(({place_name, description}) => ({place_name, description}));
    this.toursPlaces.forEach(place => place.id = this.toursPlaceId++);

    this.tourForm.setValue({
      name: this.tour.name,
      description: this.tour.description,
      country_id: this.tour.city.country_id,
      city_id: this.tour.city_id,
      list_price: this.tour.list_price,
      sale_price: this.tour.sale_price,
      max_people: this.tour.max_people,
      duration: this.tour.duration,
      meeting_address: this.tour.meeting_address,
      category_id: this.tour.category_id,
      transport_id: this.tour.transport_id,
      included_benefits: this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included === true).map(toursBenefit => toursBenefit.benefit),
      excluded_benefits: this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included !== true).map(toursBenefit => toursBenefit.benefit),
    });
    this.includedBenefits = this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included === true).map(toursBenefit => toursBenefit.benefit);
    this.excludedBenefits = this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included !== true).map(toursBenefit => toursBenefit.benefit);
    this.getCities();
  }
  showToursEditInfo() {
    this.isShowToursEdit = true;
    this.coverImage = this.toursEdit.cover_image;
    this.coverImageLink = this.toursEdit.cover_image;

    this.toursPlaces = this.toursEdit.toursPlaces;
    this.toursPlaces = this.toursPlaces.map(({place_name, description}) => ({place_name, description}));
    this.toursPlaces.forEach(place => place.id = this.toursPlaceId++);

    this.tourForm.setValue({
      name: this.toursEdit.name,
      description: this.toursEdit.description,
      country_id: this.toursEdit.city.country_id,
      city_id: this.toursEdit.city_id,
      list_price: this.tour.list_price,
      sale_price: this.tour.sale_price,
      max_people: this.tour.max_people,
      duration: this.tour.duration,
      meeting_address: this.toursEdit.meeting_address,
      category_id: this.toursEdit.category_id,
      transport_id: this.toursEdit.transport_id,
      included_benefits: this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included === true).map(toursBenefit => toursBenefit.benefit),
      excluded_benefits: this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included !== true).map(toursBenefit => toursBenefit.benefit),
    });
    this.includedBenefits = this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included === true).map(toursBenefit => toursBenefit.benefit);
    this.excludedBenefits = this.tour.toursBenefits.filter(toursBenefit => toursBenefit.is_included !== true).map(toursBenefit => toursBenefit.benefit);
    this.getCities();
  }

  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'benefit_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true,
    limitSelection: -1
  };

  ngOnInit(): void {
    this.addPlace();
    this.translateLang();
  }  

  isTourSubmitted: boolean = false;
  updateTour(){
    console.log(this.tourForm.controls.name.value);
    console.log(this.tourForm.controls.description.value);
    console.log(this.tourForm.controls.city_id.value);
    console.log(this.tourForm.controls.list_price.value);
    console.log(this.tourForm.controls.sale_price.value);
    console.log(this.tourForm.controls.max_people.value);
    console.log(this.tourForm.controls.duration.value);
    console.log(this.tourForm.controls.meeting_address.value);
    console.log(this.tourForm.controls.category_id.value);
    console.log(this.tourForm.controls.transport_id.value);
    console.log(this.coverImageLink);
    console.log(this.toursPlaces);
    console.log(this.toursImages);
    this.toursBenefits = this.getToursBenefitsArray();
    console.log(this.toursBenefits);

    this.isTourSubmitted = true;
    if (this.tourForm.invalid
      || this.coverImageLink == null
      || this.tourForm.controls.list_price.value < this.tourForm.controls.sale_price.value
      || this.toursPlaces.findIndex(place => place.place_name === '' || place.description === '') !== -1) {
      return;
    }
    this.spinner.show();
    return this.TourService.updateTour(this.tourId, this.tourForm.controls, this.coverImageLink, this.toursBenefits, this.toursPlaces)
    .subscribe(
      (result) => {
        console.log(result);
        this.spinner.hide();
        if (result.code === 20001) {
          this.dialog.show("Your request to edit tour has been submitted", "success");
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

  getCities() {
    this.MasterDataService.getCities(this.tourForm.controls.country_id.value).subscribe(
      (result) => {
        this.spinner.hide();
        this.cities = result.data.cities;
        // this.isLoaded = true;

        if (!this.cities.length) {
          this.tourForm.get('city_id').disable();
          return;
        }
        this.tourForm.get('city_id').enable();
        
        let cityId = null;
        if (!this.isShowToursEdit) {
          cityId = this.tour.city.country_id !== this.tourForm.controls.country_id.value ? this.cities[0].city_id : this.tour.city_id;
        } else {
          cityId = this.toursEdit.city.country_id !== this.tourForm.controls.country_id.value ? this.cities[0].city_id : this.toursEdit.city_id
        }
        this.tourForm.setValue({
          name: this.tourForm.controls.name.value,
          description: this.tourForm.controls.description.value,
          country_id: this.tourForm.controls.country_id.value,
          city_id: cityId,
          list_price: this.tourForm.controls.list_price.value,
          sale_price: this.tourForm.controls.sale_price.value,
          max_people: this.tourForm.controls.max_people.value,
          duration: this.tourForm.controls.duration.value,
          meeting_address: this.tourForm.controls.meeting_address.value,
          category_id: this.tourForm.controls.category_id.value,
          transport_id: this.tourForm.controls.transport_id.value,
          included_benefits: this.tourForm.controls.included_benefits.value ? this.tourForm.controls.included_benefits.value : '',
          excluded_benefits: this.tourForm.controls.excluded_benefits.value ? this.tourForm.controls.excluded_benefits.value : '',
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  toursBenefits: any[] = [];
  getToursBenefitsArray() {
    const toursBenefits = [];
    this.tourForm.controls.included_benefits.value.forEach(benefit => {
      toursBenefits.push({
        benefit_id: benefit.benefit_id,
        is_included: true,
      });
    });
    this.tourForm.controls.excluded_benefits.value.forEach(benefit => {
      toursBenefits.push({
        benefit_id: benefit.benefit_id,
        is_included: false,
      });
    });
    return toursBenefits;
  }
  

  coverImage: any;
  previewCoverImage(files: FileList) {
    if (files.length) {
      this.uploadCoverImage(files);
    }
  }

  coverImageLink: string = null;
  uploadCoverImage(files: FileList) {
    this.coverImage = 'https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif';
    this.TourService.uploadImage(files.item(0)).subscribe(
      (result) => {
        console.log(result.data);
        this.coverImageLink = result.data;
        this.coverImage = this.coverImageLink;
      },
      (error) => {
        console.log(error);
      });
  }

  currentNumberOfImages: number = 0;
  isUploadingImage: boolean = false;
  toursImages: any[] = [];
  uploadTourImage(files: FileList) {
    this.isUploadingImage = true;
    this.currentNumberOfImages = this.toursImages.length + files.length;
    for (let index = 0; index < files.length; index++) {
      this.ToursImageService.createToursImage(this.tourId, files.item(index)).subscribe(
        (result) => {
          console.log(result.data);
          this.toursImages.push({
            id: this.toursImageId++,
            path: result.data.path,
            status: 0
          });
          if (this.currentNumberOfImages === this.toursImages.length) {
            this.isUploadingImage = false;
          }
        },
        (error) => {
          console.log(error);
        });
    }
  }

  removeImage(toursImage: any) {
    this.toursImages = this.toursImages.filter(image => image.id !== toursImage.id);
    this.ToursImageService.deleteToursImage(toursImage).subscribe(
      (result) => {
        console.log(result.data);
      },
      (error) => {
        console.log(error);
      });
  }


  // USER FORM
  form = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
    ]),
    description: new FormControl("", [
      Validators.required,
    ]),
    country_id: new FormControl("", [
      Validators.required,
    ]),
    city_id: new FormControl("", [
      Validators.required,
    ]),
    list_price: new FormControl("", [
      Validators.required,
    ]),
    sale_price: new FormControl("", [
      Validators.required,
    ]),
    max_people: new FormControl("", [
      Validators.required,
    ]),
    duration: new FormControl("", [
      Validators.required,
    ]),
    meeting_address: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
    ]),
    category_id: new FormControl("", [
      Validators.required,
    ]),
    transport_id: new FormControl("", [
      Validators.required,
    ]),
    included_benefits: new FormControl("", [
      Validators.required,
    ]),
    excluded_benefits: new FormControl("", [
      Validators.required,
    ]),
  });
  tourForm = this.form;
  
  toursPlaces: any[] = [];
  removePlace(toursPlace) {
    if (this.toursPlaces.length === 1) {
      this.dialog.show('A tour has at least one place in itinerary', 'error')
      return;
    }
    this.toursPlaces = this.toursPlaces.filter(place => place.id !== toursPlace.id);
  }

  addPlace() {
    this.toursPlaces.push({
      id: this.toursPlaceId++,
      place_name: '',
      description: '',
    });
  }

  imagePath: any;
  getImage(imagePath) {
    this.imagePath = imagePath;
  }

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}
