import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppHelperService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:3000/createSheet';

  httpOptions = {
    headers: new HttpHeaders({
     'Content-Type':  'application/json',
     'responseType': 'text' })};
     

     postResultData(resultData): Observable<any>{ 

       return this.http.post<any>(this.baseUrl, resultData, this.httpOptions);
     }

}
