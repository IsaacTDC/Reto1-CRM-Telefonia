import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {enviroment} from '../../enviroment/enviroment';
import { Observable, ObservedValuesFromArray } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class PhonesService {
  private apiUrl = enviroment.apiUrl + '/phones';
  constructor(private http: HttpClient) { }

  getPhonesByClientId(id: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
