import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PhonesService } from '../../services/phones.service';

@Component({
  selector: 'app-client-detail',
  imports: [DialogModule,CommonModule],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit{
  @Input() client: any;
  @Input() telefonos: any[] = [];
  phones: any[] =[];

  constructor(private apiService: PhonesService){}
  
  ngOnInit(): void {
    this.getPhones();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client?.id) {
      this.getPhones();
    }
  }

  public getPhones(){
    this.apiService.getPhonesByClientId(this.client.id).subscribe(res =>{
      this.phones = res.data;
      console.log(res.data);
    });
  }

}

