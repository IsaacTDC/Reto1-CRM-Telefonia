import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
import { PrimeIcons } from 'primeng/api';
import { PhonesService } from '../../services/phones.service';

@Component({
  selector: 'app-client-table',
  imports: [TableModule,
            CommonModule,
            ButtonModule,
            DialogModule,
            ClientDetailComponent
          ],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss'
})
export class ClientTableComponent {
  @Input() clients: any[] = [];

  selectedClient: any = null;
  displayDialog = false;
  constructor(private phoneService: PhonesService){}

  showDetails(client: any){
    this.selectedClient = client;
    this.displayDialog = true;
  }

  onRowExpand(event: any) {
  const client = event.data;

    this.phoneService.getPhonesByClientId(client.id).subscribe(phones => {
      client.phones = phones;
    });
  }

  editClient(client: any){
    
  }

  addPhone(cliente: any){

  }

}
