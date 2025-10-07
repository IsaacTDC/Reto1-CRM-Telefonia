import { Component , Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConsumptionsService } from '../../services/consumptions.service';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConsumptionChartComponent } from "../consumption-chart/consumption-chart.component";

@Component({
  selector: 'app-phone-consumptions',
  imports: [CommonModule, TableModule, ButtonModule, SelectModule, InputNumberModule, FormsModule, ToastModule, ConfirmDialogModule, ConsumptionChartComponent],
  templateUrl: './phone-consumptions.component.html',
  styleUrl: './phone-consumptions.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class PhoneConsumptionsComponent implements OnInit{
  @Input() phone: any;
  consumptions: any[] = [];
  summaryData: { min: number; max: number; avg: number } | null = null;

  selectedYear: number = new Date().getFullYear(); //vamos atomar el año actual por defecto
  loading = false;
  errorMsg = '';

  //estructura para insertar un nuevo consumo
  newConsumption: { mes: number | null; consumo: number | null } = { mes: null, consumo: null };

  //las opciones q mostramos de años <--- revisar para solo mostrar los años en que haya datos
  yearOptions: { label: string; value: number }[] = [];

  //opciones de mese mas trivial
  monthOptions: { label: string; value: number }[] = [];

  constructor(
    private consumptionService: ConsumptionsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    if (this.phone) {
      this.generateYearOptions();
      this.generateMonthOptions();
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
    for (let y = currentYear; y >= currentYear - 6; y--) {
      this.yearOptions.push({ label: y.toString(), value: y });
    }
  }

  generateMonthOptions() {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.monthOptions = meses.map((m, i) => ({ label: m, value: i + 1 }));
  }

  loadConsumptions() {
    if (!this.phone?.id || !this.selectedYear) return;

    this.loading = true;
    this.consumptionService.getByPhoneAndYear(this.phone.id, this.selectedYear).subscribe({
        next: (res: any) => {
          this.consumptions = res.data || [];
          this.loading = false;
          if (this.consumptions.length > 0) { //vamos a cargar los datos estadisticos aqui ya qeu si no hay datos de consumos no tiene sentido q haya estats
            this.loadSummary();
          }
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

  loadSummary() {
    this.consumptionService.getConsumptionSummary(this.phone.id, this.selectedYear).subscribe({
      next: (res: any) => {
        this.summaryData = res.data;
        //console.log(this.summaryData);
      },
      error: () => {
        this.summaryData = null;
      }
    });
  }

  onYearChange() {
    console.log(this.selectedYear);
    this.loadConsumptions();
  }

  onAdd() {
    if (!this.newConsumption.mes || !this.newConsumption.consumo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Debes seleccionar el mes y el consumo'
      });
      return;
    }

    const payload = {
      mes: this.newConsumption.mes,
      anio: this.selectedYear,
      consumo: this.newConsumption.consumo,
      telefonoId: this.phone.id
    };

    this.consumptionService.create(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consumo añadido correctamente'
        });
        this.newConsumption = { mes: null, consumo: null };
        this.loadConsumptions();
      },
      error: (err) => {
        //console.log(err);
        const msg = err.error?.msg || 'Error al guardar el consumo';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      }
    });
  }

  onEdit(item: any) {
    // abrir modal de edición
  }

  onDelete(item: any) {
    const mesNombre = this.monthOptions.find((m) => m.value === item.mes)?.label || item.mes;

    this.confirmationService.confirm({
      header: '¿Eliminar consumo?',
      message: `¿Seguro que deseas eliminar el consumo de ${mesNombre} de ${this.selectedYear}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.consumptionService.delete(item.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: `Consumo de ${mesNombre} eliminado correctamente`
            });
            this.loadConsumptions();
          },
          error: (err) => {
            const msg = err.error?.message || 'Error al eliminar el consumo';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
          }
        });
      }
    });
  }
  exportToPDF(){}

  
}
