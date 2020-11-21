import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get<any>(`${environment.apiUrl}/countries`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
  
  getCountriesWithTheMostTours(limit: number) {
    return this.http.get<any>(`${environment.apiUrl}/countries/the-most-tours?limit=${limit}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getCities(country_id: any) {
    return this.http.get<any>(`${environment.apiUrl}/cities?country_id=${country_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getLanguages() {
    return this.http.get<any>(`${environment.apiUrl}/languages`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

}
