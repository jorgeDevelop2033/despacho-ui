import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DespachoService, DespachoBusquedaDto } from '../../../core/services/despacho.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-despachos-buscar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './buscar-despachos.component.html',
})
export class DespachosBuscarComponent implements OnInit {
  fechaControl = new FormControl<string | null>(null);
  despachos: DespachoBusquedaDto[] = [];
  despachosFiltrados: DespachoBusquedaDto[] = [];
  cargando = false;
  today = new Date().toISOString().substring(0, 10);

  constructor(
    private despachosService: DespachoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerDespachos();
  }

  buscarPorFecha(): void {
    const fecha = this.fechaControl.value;
    if (!fecha) return;

    this.cargando = true;
    this.despachosService.obtenerDespachos(fecha).subscribe({
      next: data => {
        this.despachosFiltrados = data;
        this.cargando = false;
      },
      error: () => {
        this.despachosFiltrados = [];
        this.cargando = false;
      }
    });
  }

  limpiarFiltro(): void {
    this.fechaControl.reset();
    this.despachosFiltrados = [...this.despachos];
  }

  private obtenerDespachos(): void {
    this.cargando = true;
    this.despachosService.obtenerDespachos().subscribe({
      next: data => {
        this.despachos = data;
        this.despachosFiltrados = [...data];
        this.cargando = false;
      },
      error: () => {
        this.despachos = [];
        this.despachosFiltrados = [];
        this.cargando = false;
      }
    });
  }

  generarDevolucion(despachoId: string): void {
    this.router.navigate(['/devoluciones/formulario', despachoId]);
  }

  verDetalles(despachoId: string): void {
    this.router.navigate(['/despachos/detalle', despachoId]);
  }
}
