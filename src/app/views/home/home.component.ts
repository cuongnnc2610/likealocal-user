import { Component, OnInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { CategoryService, TourService, MasterDataService } from '../../_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DialogComponent } from '../../components';
import { Tour, Category } from '../../_models';

@Component({
  selector: 'app-tour',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;

  Math = Math;
  Number = Number;

  constructor(
    private CategoryService: CategoryService,
    private MasterDataService: MasterDataService,
    private TourService: TourService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getCategories();
    this.getCountriesWithTheMostTours();
  }

  categories: Category[] = [];
  categoriesSearchOptions: Category[] = [];
  getCategories() {
    this.CategoryService.getCategories(null, 1).subscribe(
      (result) => {
        this.categories = result.data.categories;
        this.categoriesSearchOptions = JSON.parse(JSON.stringify(this.categories));

        // Remove 'tour' in name
        this.categories = this.categories.map(category => ({
          ...category,
          name: category.name.replace(' tour', ''),
        }));

        // Add 'All" to search options
        this.categoriesSearchOptions.unshift({
          category_id: 0,
          name: 'All'
        });

        console.log(this.categories);
        console.log(this.categoriesSearchOptions);
        this.getToursByCategory();
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  countriesWithTheMostTours = [];
  getCountriesWithTheMostTours() {
    const numberOfCountries = 6;
    this.MasterDataService.getCountriesWithTheMostTours(numberOfCountries).subscribe(
      (result) => {
        console.log(result);
        this.countriesWithTheMostTours = result.data.countries;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  toursByCategory = [];
  getToursByCategory() {
    this.categories.forEach(category => {
      this.toursByCategory.push({
        category_id: category.category_id,
        name: category.name,
        tours: [],
      });
      this.TourService.getToursByCategory(category.category_id, 8, 15).subscribe(
        (result) => {
          console.log(result);
          this.toursByCategory.find(tourByCategory => tourByCategory.category_id === category.category_id).tours = result.data.data;
        },
        (error) => {
          this.spinner.hide();
          this.dialog.show(error, 'error');
        }
      );
    });
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    start_date: new FormControl("", []),
    end_date: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      start_date: '',
      end_date: '',
    });
  }
}
