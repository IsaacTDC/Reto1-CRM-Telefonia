import { Component, Input, OnInit, OnChanges, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
import { PhonesService } from '../../services/phones.service';
import { ClientEditComponent } from '../client-edit/client-edit.component';
import { ClientsService } from '../../services/clients.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-client-table',
  imports: [TableModule,
            CommonModule,
            ButtonModule,
            DialogModule,
            ClientDetailComponent,
            ClientEditComponent,
            ReactiveFormsModule,
            FormsModule,
            InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, InputNumberModule,
            ConfirmDialogModule
  ],
  providers: [MessageService,ConfirmationService], 
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss'
})
export class ClientTableComponent implements OnInit{
  clients: any[] = [];
  

  selectedClient: any = null;
  displayDialog = false; //modal para mostrar la información

  editDialog = false;   // modal de edicion
  editingClient: any = null;

  newClientForm!: FormGroup; //formulario para añadir cliente
  newClient: any = { nombre: '', dni: '', telefonos: [{ numero: '' }] };//variable para la ceración de clientes con telefonos

  saving = false; // indica que estamos guardando en backend

  constructor(private fb: FormBuilder,
              private clientService: ClientsService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService
  ){}

  ngOnInit() {
    this.llamarApi();
    this.newClientForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', Validators.required]
    });
  }

  llamarApi(){
    this.clientService.getAllClients().subscribe( res => {
      this.clients = res.data;
      //console.log(this.clients);
    });
  }

  ngOnchanges(){
    //this.llamarApi();
  }

  showDetails(client: any){
    this.selectedClient = client;
    this.displayDialog = true;
  } 

  editUser(client: any) {
    //console.log(client);
    this.editingClient = {
      ...client,
      telefonos: client.Telefono
        ? client.Telefono.map((t: any) => ({ id: t.id, numero: t.numero }))
        : []
    };
    
    this.editDialog = true;
  }
  onSaveClient(updatedClient: any) {
    const id = updatedClient.id;
    if (!id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cliente sin id' });
      return;
    }
    console.log(updatedClient);
    // construir payload<----------repasa esto y argumentos
    const payload = {
      nombre: updatedClient.nombre,
      dni: updatedClient.dni,
      telefonos: updatedClient.telefonos?.map((t: any) => ({
        id: t.id,       //ahora incluimos el id si existe
        numero: t.numero
      })) || []
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

  addPhone() {
    this.newClient.telefonos.push({ numero: '' });
  }

  removePhone(index: number) {
    this.newClient.telefonos.splice(index, 1);
  }

  addClient() {
    if (!this.newClient.nombre || !this.newClient.dni) return;
    /* const payload = this.newClientForm.value;
    this.saving = true; //actulizamos la variable de carga */

    
    this.clientService.createClient(this.newClient).subscribe({ //llamamos la servicio
      next: (res: any) => {
        //console.log(res);
        this.clients.push(res.data); //añadimos a la tabla
        this.newClient = { nombre: '', dni: '', telefonos: [] }; // reset
        this.newClientForm.reset();
        this.saving = false;
      },
      error: (err) => {
        console.error('Error createClient', err);
        this.saving = false;
      }
    });
  }

  deleteClient(client: any) {
    console.log(client);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${client.nombre}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.clientService.deleteClient(client.id).subscribe({
          next: () => {
            // actualizar lista local
            this.clients = this.clients.filter(c => c.id !== client.id);
          },
          error: (err) => {
            console.error('Error al eliminar cliente', err);
          }
        });
      }
    });
  }

}
