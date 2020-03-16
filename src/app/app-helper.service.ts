import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppHelperService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:3000/createSheet';

  httpOptions = {
    headers: new HttpHeaders({
     'Content-Type':  'application/json'})};


     postResultData(resultData){
       return this.http.post(this.baseUrl, resultData, this.httpOptions);
     }
}
