import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {enviroment} from '../../enviroment/enviroment';
import { Observable, ObservedValuesFromArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConsumptionsService {
  private apiUrl = enviroment.apiUrl + '/consumptions';
  constructor(private http: HttpClient) {}

  getByPhoneAndYear(phoneId: number, year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${phoneId}/${year}`);
  }

  create(consumption: any): Observable<any> {
    return this.http.post(this.apiUrl, consumption);
  }

  update(id: number, consumption: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, consumption);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getConsumptionSummary(phoneId: number, year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary/${phoneId}/${year}`);
  }

}