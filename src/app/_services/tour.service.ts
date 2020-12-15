import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(private http: HttpClient) { }

  getToursByFilter(numberPage, searchInputForm, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/tours?page=${numberPage}&limit=${10}&country_id=${searchInputForm.country_id.value}&city_id=${searchInputForm.city_id.value}&category_id=${searchInputForm.category_id.value}&transport_id=${searchInputForm.transport_id.value}&host_name=${searchInputForm.host_name.value}&name=${searchInputForm.name.value}&status=${searchInputForm.status.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getTours(numberPage, limit, countryId, cityId, categoryId, transportId, name = '', orderType) {
    return this.http.get<any>(`${environment.apiUrl}/tours?page=${numberPage}&limit=${limit}&country_id=${countryId}&city_id=${cityId}&category_id=${categoryId}&transport_id=${transportId}&name=${name}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getToursByCategory(categoryId: number, limit: number, orderType: number) {
    return this.http.get<any>(`${environment.apiUrl}/tours?page=${1}&limit=${limit}&category_id=${categoryId}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getTour(tour_id: any) {
    return this.http.get<any>(`${environment.apiUrl}/tours/${tour_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateStatusOfTour(tour: any) {
    return this.http.put<any>(`${environment.apiUrl}/tours/publish/${tour.tour_id}`, {
      status: tour.new_status,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createTour(tourForm: any, coverImageLink: string, toursBenefits: any, toursPlaces: any, toursImages: any) {
    return this.http.post<any>(`${environment.apiUrl}/tours`, {
      name: tourForm.name.value,
      description: tourForm.description.value,
      city_id: tourForm.city_id.value,
      list_price: tourForm.list_price.value,
      sale_price: tourForm.sale_price.value,
      max_people: tourForm.max_people.value,
      duration: tourForm.duration.value,
      meeting_address: tourForm.meeting_address.value,
      category_id: Number(tourForm.category_id.value),
      transport_id: Number(tourForm.transport_id.value),
      cover_image: coverImageLink,
      tours_benefits: toursBenefits,
      tours_places: toursPlaces,
      tours_images: toursImages,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateTour(tourId: number, tourForm: any, coverImage: string, toursBenefits: any, toursPlaces: any) {
    return this.http.put<any>(`${environment.apiUrl}/tours/${tourId}`, {
      name: tourForm.name.value,
      description: tourForm.description.value,
      city_id: Number(tourForm.city_id.value),
      list_price: tourForm.list_price.value,
      sale_price: tourForm.sale_price.value,
      max_people: tourForm.max_people.value,
      duration: tourForm.duration.value,
      meeting_address: tourForm.meeting_address.value,
      category_id: Number(tourForm.category_id.value),
      transport_id: Number(tourForm.transport_id.value),
      cover_image: coverImage,
      tours_benefits: toursBenefits,
      tours_places: toursPlaces,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  uploadImage(fileToUpload: any) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(`${environment.apiUrl}/tours/images`, formData)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getToursOfHost(hostId: number, limit: number = 100, orderType: number) {
    return this.http.get<any>(`${environment.apiUrl}/tours?page=${1}&limit=${limit}&host_id=${hostId}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteTour(tour) {
    return this.http.delete<any>(`${environment.apiUrl}/tours/${tour.tour_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  showOrHideTour(tour: any) {
    return this.http.put<any>(`${environment.apiUrl}/tours/show/${tour.tour_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

}
