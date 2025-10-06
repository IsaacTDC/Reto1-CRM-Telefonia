import { Component, Input, OnInit, SimpleChanges, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PhonesService } from '../../services/phones.service';
import { PhoneConsumptionsComponent } from '../phone-consumptions/phone-consumptions.component';
import { Button } from "primeng/button";

@Component({
  selector: 'app-client-detail',
  imports: [DialogModule, CommonModule, PhoneConsumptionsComponent, Button],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit, OnChanges{
  @Input() client: any;
  phones: any[] =[];

  displayConsumptions = false;
  selectedPhone: any = null;

  constructor(private apiService: PhonesService,
      private cdr: ChangeDetectorRef
  ){}
  
  ngOnInit(): void {
    //this.setPhonesFromClient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client?.id) {
      this.setPhonesFromClient();
    }
  }


  private setPhonesFromClient() {
    // Usar los teléfonos que vienen en el cliente
    this.phones = this.client.Telefono ?? [];
    //console.log('Teléfonos cargados en detalle:', this.phones);
  }

  consumptionsModal(phone: any) {
    //console.log(phone);
    this.selectedPhone = phone;
    this.displayConsumptions = true;
  }

  closeConsumptionsModal() {
    this.displayConsumptions = false;
    this.selectedPhone = null;
  }

}

