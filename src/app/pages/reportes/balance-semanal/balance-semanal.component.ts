import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { BalanceSemanal, ReportesService } from '../../../core/services/reportes.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-balance-semanal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-semanal.component.html'
})
export class BalanceSemanalComponent {
  datos$: Observable<any[]>;
  total = {
    lunes: 0, martes: 0, miercoles: 0, jueves: 0,
    viernes: 0, sabado: 0, domingo: 0, totalGeneral: 0
  };
  datosExportar: any[] = [];

  constructor(private reportesService: ReportesService) {
    const datosRaw$ = this.reportesService.obtenerBalanceSemanal();

    this.datos$ = datosRaw$.pipe(
      map(datos => this.transformarDatos(datos))
    );

    // Guardamos datos para exportar
    datosRaw$.subscribe(datos => {
      this.datosExportar = this.transformarDatos(datos);
    });
  }

  transformarDatos(datos: BalanceSemanal[]): any[] {
    const productosMap = new Map<string, any>();

    // Reiniciamos los totales
    this.total = {
      lunes: 0, martes: 0, miercoles: 0, jueves: 0,
      viernes: 0, sabado: 0, domingo: 0, totalGeneral: 0
    };

    for (const item of datos) {
      const dia = item.diaSemana.toLowerCase();
      const cantidad = item.balanceKg || 0;

      // Si el producto no está en el mapa, lo inicializamos
      if (!productosMap.has(item.productoId)) {
        productosMap.set(item.productoId, {
          Producto: item.productoNombre,
          Lunes: 0, Martes: 0, Miercoles: 0, Jueves: 0,
          Viernes: 0, Sabado: 0, Domingo: 0, Total: 0
        });
      }

      const producto = productosMap.get(item.productoId);

      // Acumulamos las cantidades y sumamos a totales por día
      switch (dia) {
        case 'lunes': producto.Lunes += cantidad; this.total.lunes += cantidad; break;
        case 'martes': producto.Martes += cantidad; this.total.martes += cantidad; break;
        case 'miércoles': producto.Miercoles += cantidad; this.total.miercoles += cantidad; break;
        case 'jueves': producto.Jueves += cantidad; this.total.jueves += cantidad; break;
        case 'viernes': producto.Viernes += cantidad; this.total.viernes += cantidad; break;
        case 'sábado': producto.Sabado += cantidad; this.total.sabado += cantidad; break;
        case 'domingo': producto.Domingo += cantidad; this.total.domingo += cantidad; break;
      }

      // Acumulamos total por producto y total general
      producto.Total += cantidad;
      this.total.totalGeneral += cantidad;
    }

    // Aseguramos que todos los días están bien sumados incluso si hay días sin registros
    return Array.from(productosMap.values());
  }

  exportarPDF() {
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text('Balance Semanal', 14, 20);

    const encabezados = [['Producto', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Total']];
    const filas = this.datosExportar.map(item => [
      item.Producto, item.Lunes, item.Martes, item.Miercoles, item.Jueves,
      item.Viernes, item.Sabado, item.Domingo, item.Total
    ]);

    // Agregamos la fila de totales
    filas.push([
      'Totales', this.total.lunes, this.total.martes, this.total.miercoles,
      this.total.jueves, this.total.viernes, this.total.sabado, this.total.domingo, this.total.totalGeneral
    ]);

    autoTable(doc, { head: encabezados, body: filas, startY: 30 });
    doc.save('BalanceSemanal.pdf');
  }
}
