import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-despachos-entrega-filtros.component.html'
  })
export class FiltroBusquedaComponent {
  vendedores = ['Juan', 'María', 'Pedro', 'Ana'];
  vendedorSeleccionado = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  filtrar() {
    console.log('Vendedor:', this.vendedorSeleccionado);
    console.log('Desde:', this.fechaDesde);
    console.log('Hasta:', this.fechaHasta);
    // Aquí iría la lógica para llamar al servicio y filtrar resultados
  }

  limpiar() {
    this.vendedorSeleccionado = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
  }
}
