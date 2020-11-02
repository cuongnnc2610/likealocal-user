import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {

  constructor(private http: HttpClient) { }

  getSystemSettings() {
    return this.http.get<any>(`${environment.apiUrl}/system-settings`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateSystemSetting(systemSetting: any) {
    return this.http.put<any>(`${environment.apiUrl}/system-settings/${systemSetting.system_setting_id}`, {
      value: systemSetting.value,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
