import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(searchInputForm: any = null, orderType: any) {
    return this.http.get<any>(`${environment.apiUrl}/categories?name=${searchInputForm ? searchInputForm.name.value : ''}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createCategory(category: any) {
    return this.http.post<any>(`${environment.apiUrl}/categories`, {
      name: category.name,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateCategory(category: any) {
    return this.http.put<any>(`${environment.apiUrl}/categories/${category.category_id}`, {
      name: category.name,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteCategory(category: any) {
    return this.http.delete<any>(`${environment.apiUrl}/categories/${category.category_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
