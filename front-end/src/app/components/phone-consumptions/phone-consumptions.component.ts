import { Component , Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConsumptionsService } from '../../services/consumptions.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-phone-consumptions',
  imports: [CommonModule, TableModule, ButtonModule, SelectModule, InputNumberModule, FormsModule],
  templateUrl: './phone-consumptions.component.html',
  styleUrl: './phone-consumptions.component.scss'
})
export class PhoneConsumptionsComponent implements OnInit{
  @Input() phone: any;
  consumptions: any[] = [];

  selectedYear: number = new Date().getFullYear(); //vamos atomar el año actual por defecto
  loading = false;

  errorMsg = '';

  //las opciones q mostramos de años <--- revisar para solo mostrar los años en que haya datos
  yearOptions: { label: string; value: number }[] = []; 

  constructor(
    private consumptionService: ConsumptionsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.phone) {
      this.generateYearOptions();
      this.selectedYear = new Date().getFullYear();
      this.loadConsumptions();
      }
  }

  ngOnChanges() {
    if (this.phone) {
      this.loadConsumptions();
    }
  }

  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.yearOptions.push({ label: y.toString(), value: y });
    }
  }

  loadConsumptions() {
    if (!this.phone?.id || !this.selectedYear) return;

    this.loading = true;
    this.consumptionService.getByPhoneAndYear(this.phone.id, this.selectedYear).subscribe({
        next: (res: any) => {
          this.consumptions = res.data || [];
          this.loading = false;
        },
        error: (err) => {
           if (err.status === 404) {
            this.consumptions = [];
            this.errorMsg = 'No hay consumos registrados para este año.';
          } else {
            console.error('Error al obtener consumos', err);
            this.errorMsg = 'Error al cargar los consumos.';
          }
        }
    });
  }

  onYearChange() {
    console.log(this.selectedYear);
    this.loadConsumptions();
  }

  onAdd() {
    // abrir modal
  }

  onEdit(item: any) {
    // abrir modal de edición
  }

  onDelete(item: any) {
    // confirmar y eliminar
  }
}
