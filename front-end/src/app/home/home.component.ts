import { Component, OnInit } from '@angular/core';
import { PhonesService } from '../services/phones.service';
import {ClientsService} from '../services/clients.service';
import { ClientsTableComponent } from './clients-table/clients-table.component';
import { CommonModule } from '@angular/common';
import { ClientTableComponent } from '../components/client-table/client-table.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule,ClientTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  clients: any[] = [];

  constructor(private apiService: ClientsService){}

  ngOnInit(): void { //llamamamos a la api al inicar el componente
    this.llamarApi();
  }

  llamarApi(){
    this.apiService.getAllClients().subscribe( res => {
      this.clients = res.data;
      console.log(this.clients);
    });
  }

}
