import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http: HttpClient) { }

  getStatistics(searchInputForm) {
    let startDate = '';
    if (searchInputForm.start_date.value !== '' && searchInputForm.start_date.value !== null) {      
      startDate = searchInputForm.start_date.value.toISOString().substring(0, 10);
    }
    let endDate = '';
    if (searchInputForm.end_date.value !== '' && searchInputForm.end_date.value !== null) {      
      endDate = searchInputForm.end_date.value.toISOString().substring(0, 10);
    }
    return this.http.get<any>(`${environment.apiUrl}/statistics?start_date=${startDate}&end_date=${endDate}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
