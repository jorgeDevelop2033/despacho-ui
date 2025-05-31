import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selector-fecha',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './selector-fecha.component.html',
  styleUrls: ['./selector-fecha.component.css']
})
export class SelectorFechaComponent {
  anios: number[] = [];
  meses: { id: number, nombre: string }[] = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];
  semanas: { id: number, label: string }[] = [];

  anioSeleccionado: number = new Date().getFullYear();
  mesSeleccionado: number = new Date().getMonth() + 1;

  constructor() {
    const anioActual = new Date().getFullYear();
    this.anios = Array.from({ length: 10 }, (_, i) => anioActual - i); // Últimos 10 años
    this.generarSemanas();
  }

  onCambioAnio() {
    this.generarSemanas();
  }

  onCambioMes() {
    this.generarSemanas();
  }

  generarSemanas() {
    this.semanas = [];
    const primerDiaMes = new Date(this.anioSeleccionado, this.mesSeleccionado - 1, 1);
    const ultimoDiaMes = new Date(this.anioSeleccionado, this.mesSeleccionado, 0);

    let inicio = new Date(primerDiaMes);
    inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7)); // Mover al lunes anterior

    let semana = 1;
    while (inicio <= ultimoDiaMes) {
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);

      // Aseguramos que fin no exceda el último día del mes
      const fechaInicio = this.formatearFecha(inicio);
      const fechaFin = this.formatearFecha(fin > ultimoDiaMes ? ultimoDiaMes : fin);

      this.semanas.push({
        id: semana,
        label: `Semana ${semana}: ${fechaInicio} - ${fechaFin}`
      });

      inicio.setDate(inicio.getDate() + 7);
      semana++;
    }
  }

  formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
}
