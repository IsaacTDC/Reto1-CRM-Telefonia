import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
import { PhonesService } from '../../services/phones.service';
import { ClientEditComponent } from '../client-edit/client-edit.component';
import { ClientsService } from '../../services/clients.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-client-table',
  imports: [TableModule,
            CommonModule,
            ButtonModule,
            DialogModule,
            ClientDetailComponent,
            ClientEditComponent
  ],
  providers: [MessageService], 
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss'
})
export class ClientTableComponent {
  @Input() clients: any[] = [];
  

  selectedClient: any = null;
  displayDialog = false; //modal para mostrar la información

  editDialog = false;   // modal de edicion
  editingClient: any = null;

  saving = false; // indica que estamos guardando en backend

  constructor(private phoneService: PhonesService,
              private clientService: ClientsService,
              private messageService: MessageService
  ){}

  showDetails(client: any){
    this.selectedClient = client;
    this.displayDialog = true;
  } 

  editUser(client: any){
    this.editingClient = {...client}; //hacemos un clon usando el cliente
    this.editDialog = true;
  }

  onSaveClient(updatedClient: any) {
    const id = updatedClient.id;
    if (!id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cliente sin id' });
      return;
    }

    // construir payload: normalmente solo mandas los campos editables
    const payload = {
      nombre: updatedClient.nombre,
      dni: updatedClient.dni
    };

    this.saving = true;

    this.clientService.updateClient(id, payload).subscribe({
      next: (res: any) => {
        const serverClient = res?.data ?? res;

        const idx = this.clients.findIndex(c => c.id === serverClient.id);
        if (idx !== -1) {
          this.clients[idx] = serverClient;
        }
        if (this.selectedClient?.id === serverClient.id) {
          this.selectedClient = serverClient;
        }
        this.editDialog = false;
        this.saving = false; // ponemos a falso el guaardando
      },
      error: (err) => {
        console.error('Error updateClient', err);
        this.saving = false;
      }
    });
  }

  addPhone(cliente: any){

  }

}
