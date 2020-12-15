import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToursImageService {

  constructor(private http: HttpClient) { }

  getAllToursImages(tourId) {
    return this.http.get<any>(`${environment.apiUrl}/tours-images?tour_id=${tourId}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createToursImage(tourId: any, fileToUpload: any) {
    const formData: FormData = new FormData();
    formData.append('tour_id', tourId);
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(`${environment.apiUrl}/tours-images`, formData)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteToursImage(toursImage: any) {
    return this.http.delete<any>(`${environment.apiUrl}/tours-images/${toursImage.tours_image_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
