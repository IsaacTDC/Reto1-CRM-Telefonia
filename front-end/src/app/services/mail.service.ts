import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {enviroment} from '../../enviroment/enviroment';
import { Observable, ObservedValuesFromArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MailService{
    private apiUrl = enviroment.apiUrl + '/mail';
    
    constructor(private http: HttpClient) {}

    sendConsumptionsMail(mailData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/send-consumption`, mailData);
    }
}