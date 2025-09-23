import { Component, OnInit } from '@angular/core';
import { PhonesService } from '../services/phones.service';
import {ClientsService} from '../services/clients.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  data: any[] = [];

  constructor(private apiService: ClientsService){}

  ngOnInit(): void {
    this.llamarApi();
  }

  llamarApi(){
    this.apiService.getAllClients().subscribe( data => {
      this.data = data["data"];
      console.log(this.data);
    });
  }
}
