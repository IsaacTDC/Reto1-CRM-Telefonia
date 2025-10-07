import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
Chart.register(...registerables);

@Component({
  selector: 'app-consumption-chart',
  templateUrl: './consumption-chart.component.html',
})
export class ConsumptionChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() consumos: { mes: string; consumo: number }[] = [];
  @Input() year!: number;
  @Input() summary: { min: number; max: number; avg: number } | null = null

  //para el grafico de linea
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;


  private chart?: Chart;
  private barChart?: Chart;
  private viewReady = false;

  /* summaryData = { min: 0, max: 0, avg: 0 }; */

  //para el grñafico de barras

  ngAfterViewInit(): void {
    this.viewReady = true;
    // Si ya tenemos datos cuando la vista está lista, renderizamos
    if (this.consumos?.length ) {
      this.scheduleRender();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consumos'] || changes['summary']) {
      // Si la vista ya está lista, renderizamos; si no, lo hará ngAfterViewInit
      if (this.viewReady && this.chartCanvas?.nativeElement) {
        this.scheduleRender();
      }
    }
  }

  private scheduleRender() {
    // requestAnimationFrame asegura que el canvas esté pintado en el DOM
    requestAnimationFrame(() => {
      this.renderChart();
      this.renderBarChart();
    });
    //Promise.resolve().then(() => this.renderChart());
  }

  private renderChart(): void {
    // comprobaciones defensivas
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) return;

    // destruir chart anterior si existe
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }

    const labels = this.consumos.map(c => c.mes);
    const dataValues = this.consumos.map(c => c.consumo);

    const data = {
      labels,
      datasets: [
        {
          label: `Consumo mensual (${this.year})`,
          data: dataValues,
          borderColor: 'rgba(78, 199, 22, 0.9)',
          backgroundColor: 'rgba(219, 245, 218, 0.18)',
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          pointRadius: 4
        }
      ]
    };

    const options: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Consumo' } },
        x: { title: { display: true, text: 'Mes' } }
      },
      plugins: {
        legend: { display: true, position: 'bottom' }
      }
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line' as ChartType,
      data,
      options
    });
  }

   private renderBarChart(): void {
    if (!this.barChartCanvas?.nativeElement || !this.summary) return;
    if (this.barChart) this.barChart.destroy();

    const data = {
      labels: ['Mínimo', 'Medio', 'Máximo'],
      datasets: [{
        label: `Resumen ${this.year}`,
        data: [this.summary.min, this.summary.avg, this.summary.max],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384']
      }]
    };

    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }


  ngOnDestroy(): void {
    if (this.chart) {
      this.chart?.destroy();
    }

    if(this.barChart){
      this.barChart?.destroy();
    }
  }
}
