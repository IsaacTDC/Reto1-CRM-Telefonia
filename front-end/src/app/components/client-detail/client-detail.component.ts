import { Component, Input, OnInit, SimpleChanges, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PhonesService } from '../../services/phones.service';

@Component({
  selector: 'app-client-detail',
  imports: [DialogModule,CommonModule],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit, OnChanges{
  @Input() client: any;
  //@Input() telefonos: any[] = [];
  phones: any[] =[];

  constructor(private apiService: PhonesService,
      private cdr: ChangeDetectorRef
  ){}
  
  ngOnInit(): void {
    this.setPhonesFromClient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client?.id) {
      this.setPhonesFromClient();
    }
  }

  public getPhones(){
    this.apiService.getPhonesByClientId(this.client.id).subscribe(res =>{
      this.phones = res.data;
      this.cdr.detectChanges();
      console.log(res.data);
    });
  }

  private setPhonesFromClient() {
    // Usar los teléfonos que vienen en el cliente
    this.phones = this.client.Telefono ?? [];
    this.cdr.detectChanges();
    console.log('Teléfonos cargados en detalle:', this.phones);
  }

}

