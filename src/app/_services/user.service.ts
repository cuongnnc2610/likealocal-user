import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(numberPage, searchInputForm, orderType) {
    let createdAt = '';
    if (searchInputForm.created_at.value !== '' && searchInputForm.created_at.value !== null) {      
      createdAt = searchInputForm.created_at.value.toISOString().substring(0, 10);
    }
    return this.http.get<any>(`${environment.apiUrl}/accounts?page=${numberPage}&email=${searchInputForm.email.value}&user_name=${searchInputForm.user_name.value}&is_tour_guide=${searchInputForm.is_tour_guide.value}&is_verified=${searchInputForm.is_verified.value}&level_id=${searchInputForm.level_id.value}&country_id=${searchInputForm.country_id.value}&city_id=${searchInputForm.city_id.value}&created_at=${createdAt}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/accounts/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getHost(hostId: number) {
    return this.http.get<any>(`${environment.apiUrl}/accounts/${hostId}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createUser(user: any) {
    return this.http.post<any>(`${environment.apiUrl}/sign-up`, {
      email: user.email,
      user_name: user.user_name,
      level_id: Number(user.level_id),
      password: user.password,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateProfile(userForm: any) {
    return this.http.put<any>(`${environment.apiUrl}/accounts/profile`, {
      user_name: userForm.user_name.value,
      phone_number: userForm.phone_number.value,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateHostProfile(hostForm: any) {
    return this.http.put<any>(`${environment.apiUrl}/accounts/profile`, {
      user_name: hostForm.user_name.value,
      phone_number: hostForm.phone_number.value,
      city_id: hostForm.city_id.value,
      self_introduction: hostForm.self_introduction.value,
      language_ids: hostForm.languages.value.map(language => language.language_id).join(','),
      // introduction_video: userForm.introduction_video.value,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  requestToBeHost(userForm: any, introductionVideo: any) {
    const formData: FormData = new FormData();
    formData.append('user_name', userForm.user_name.value);
    formData.append('phone_number', userForm.phone_number.value);
    formData.append('city_id', userForm.city_id.value);
    formData.append('self_introduction', userForm.self_introduction.value);
    formData.append('language_ids', userForm.languages.value.map(language => language.language_id).join(','));
    if (introductionVideo instanceof File) {
      formData.append('introduction_video', introductionVideo, introductionVideo.name);
    }
    
    return this.http.put<any>(`${environment.apiUrl}/accounts/request-to-be-host`, formData)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getProfile() {
    return this.http.get<any>(`${environment.apiUrl}/accounts/profile`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  removeAvatar(id: any) {
    return this.http.delete<any>(`${environment.apiUrl}/accounts/avatar/${id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  uploadAvatar(fileToUpload: any) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(`${environment.apiUrl}/accounts/avatar`, formData)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  uploadIntroductionVideo(fileToUpload: any) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(`${environment.apiUrl}/accounts/introduction-video`, formData)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
