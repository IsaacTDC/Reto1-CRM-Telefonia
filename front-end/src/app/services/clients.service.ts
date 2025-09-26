import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {enviroment} from '../../enviroment/enviroment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = enviroment.apiUrl + '/clients';
  constructor(private http: HttpClient) { }

  getAllClients(): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  updateClient(id:number, body:any){
    console.log(id , body);
    return this.http.put(`${this.apiUrl}/${id}`, body);
  }

}
