import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TermsOfUse} from '../_models/terms-of-use';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TermsOfUseService {

  constructor(private http: HttpClient) {
  }

  getTermsOfUse() {
    return this.http.get<TermsOfUse[]>(`${environment.apiUrl}/terms-of-use`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateTermsOfUse(data: any) {
    return this.http.put(`${environment.apiUrl}/terms-of-use`, data)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
