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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { MailService } from '../../services/mail.service';

@Component({
  selector: 'app-phone-consumptions',
  imports: [CommonModule, TableModule, ButtonModule, SelectModule, InputNumberModule, FormsModule, ToastModule, ConfirmDialogModule, ConsumptionChartComponent],
  templateUrl: './phone-consumptions.component.html',
  styleUrl: './phone-consumptions.component.scss',
  providers: [ConfirmationService, MessageService, MailService]
})
export class PhoneConsumptionsComponent implements OnInit{
  @Input() phone: any;
  consumptions: any[] = [];
  summaryData: { min: number; max: number; avg: number } | null = null;
  @Input() client: any; //para obetenr los datos para imprimir

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
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private mailService: MailService
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
    console.log(this.client);
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

  //funcion para exportar la vista de consumos a pdf
  exportToPDF() {
    if (!this.consumptions.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin datos',
        detail: 'No hay consumos para exportar a PDF'
      });
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let currentY = 20;

    //ENCABEZADO
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Informe de Consumos Telefónicos', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Titular de la línea: ${this.client?.nombre}`, margin, currentY);
    currentY += 6;
    doc.text(`DNI: ${this.client?.dni}`, margin, currentY);
    currentY += 6;
    doc.text(`Teléfono: ${this.phone?.numero}`, margin, currentY);
    currentY += 6;
    doc.text(`Consumo correspondiente al año: ${this.selectedYear}`, margin, currentY);
    currentY += 6;
    doc.text(`Fecha de generación del indorme: ${new Date().toLocaleDateString()}`, margin, currentY);
    currentY += 6;

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    //GRÁFICOS 
    const chartCanvas = document.querySelector('#chartCanvas') as HTMLCanvasElement;
    const barChartCanvas = document.querySelector('#barChartCanvas') as HTMLCanvasElement;

    if (chartCanvas) {
      const chartImage = chartCanvas.toDataURL('image/png', 1.0);
      doc.addImage(chartImage, 'PNG', margin, currentY, pageWidth - 2 * margin, 60);
      currentY += 70;
    }

    if (barChartCanvas) {
      const barChartImage = barChartCanvas.toDataURL('image/png', 1.0);
      doc.addImage(barChartImage, 'PNG', margin, currentY, pageWidth - 2 * margin, 60);
      currentY += 70;
    }

    //TABLA DE CONSUMOS
    const tableData = this.consumptions.map(c => {
      const consumoNum = parseFloat(c.consumo);
      return [
        this.monthOptions.find(m => m.value === c.mes)?.label || c.mes,
        isNaN(consumoNum) ? 'N/A' : `${consumoNum.toFixed(2)} €`
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Mes', 'Consumo (€)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, halign: 'center' },
      margin: { left: margin, right: margin },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    //RESUMEN ESTADÍSTICO
    if (this.summaryData) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Resumen estadístico', margin, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Consumo mínimo: ${this.summaryData.min.toFixed(2)} €`, margin + 6, currentY);
      currentY += 5;
      doc.text(`Consumo medio: ${this.summaryData.avg.toFixed(2)} €`, margin + 6, currentY);
      currentY += 5;
      doc.text(`Consumo máximo: ${this.summaryData.max.toFixed(2)} €`, margin + 6, currentY);
      currentY += 10;
    }

    //PIE DE PÁGINA
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      'Documento generado automáticamente -CRM Telefonía \u00AE TDconsulting',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    //GUARDAR PDF
    doc.save(`Consumos_${this.phone?.numero}_${this.selectedYear}.pdf`);
  }

  generatePDFObject() {
    if (!this.consumptions.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin datos',
        detail: 'No hay consumos para exportar a PDF'
      });
      return null;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let currentY = 20;

    // ENCABEZADO
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Informe de Consumos Telefónicos', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Titular de la línea: ${this.client?.nombre}`, margin, currentY);
    currentY += 6;
    doc.text(`DNI: ${this.client?.dni}`, margin, currentY);
    currentY += 6;
    doc.text(`Teléfono: ${this.phone?.numero}`, margin, currentY);
    currentY += 6;
    doc.text(`Consumo correspondiente al año: ${this.selectedYear}`, margin, currentY);
    currentY += 6;
    doc.text(`Fecha de generación del informe: ${new Date().toLocaleDateString()}`, margin, currentY);
    currentY += 8;

    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // GRÁFICOS
    const chartCanvas = document.querySelector('#chartCanvas') as HTMLCanvasElement;
    const barChartCanvas = document.querySelector('#barChartCanvas') as HTMLCanvasElement;

    if (chartCanvas) {
      const chartImage = chartCanvas.toDataURL('image/png', 1.0);
      doc.addImage(chartImage, 'PNG', margin, currentY, pageWidth - 2 * margin, 60);
      currentY += 70;
    }

    if (barChartCanvas) {
      const barChartImage = barChartCanvas.toDataURL('image/png', 1.0);
      doc.addImage(barChartImage, 'PNG', margin, currentY, pageWidth - 2 * margin, 60);
      currentY += 70;
    }

    // TABLA DE CONSUMOS
    const tableData = this.consumptions.map(c => [
      this.monthOptions.find(m => m.value === c.mes)?.label || c.mes,
      `${parseFloat(c.consumo).toFixed(2)} €`
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Mes', 'Consumo (€)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, halign: 'center' },
      margin: { left: margin, right: margin },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // RESUMEN
    if (this.summaryData) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Resumen estadístico', margin, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Consumo mínimo: ${this.summaryData.min.toFixed(2)} €`, margin + 6, currentY);
      currentY += 5;
      doc.text(`Consumo medio: ${this.summaryData.avg.toFixed(2)} €`, margin + 6, currentY);
      currentY += 5;
      doc.text(`Consumo máximo: ${this.summaryData.max.toFixed(2)} €`, margin + 6, currentY);
      currentY += 10;
    }

    // PIE DE PÁGINA
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      'Documento generado automáticamente - CRM Telefonía ® TDconsulting',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // 🔁 Devuelve el objeto PDF
    const pdfBlob = doc.output('blob');
    const base64 = doc.output('datauristring').split(',')[1]; // base64 sin encabezado
    const fileName = `Consumos_${this.phone?.numero}_${this.selectedYear}.pdf`;

    return { blob: pdfBlob, base64, fileName };
  }

  // 💾 2️⃣ Descargar el PDF
  downloadPDF() {
    const pdfObj = this.generatePDFObject();
    if (!pdfObj) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfObj.blob);
    link.download = pdfObj.fileName;
    link.click();

    this.messageService.add({
      severity: 'success',
      summary: 'PDF descargado',
      detail: pdfObj.fileName
    });
  }

  // 📧 3️⃣ Enviar el PDF por correo (Base64)
  sendPDFByEmail() {
    const pdfObj = this.generatePDFObject();
    if (!pdfObj) return;

    const payload = {
      to: 'usuario@ejemplo.com',
      subject: `Informe de consumos ${this.selectedYear}`,
      pdfBase64: pdfObj.base64,
      fileName: pdfObj.fileName,
    };

    this.mailService.sendConsumptionsMail(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correo enviado',
          detail: 'El informe se ha enviado correctamente.'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar el correo.'
        });
      }
    });
  }



  getMonthLabel(monthNumber: number): string {
    return this.monthOptions.find(m => m.value === monthNumber)?.label || monthNumber.toString();
  }
  
}
