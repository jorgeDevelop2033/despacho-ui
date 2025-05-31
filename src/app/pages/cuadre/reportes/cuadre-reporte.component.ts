import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CuadreReporteDto, ProductoReporteDto } from '../../../models/cuadre-reporte.model';
import { CuadreReporteService } from '../../../core/services/cuadre-reporte.service';

interface FilaCuadre {
  entrega?: ProductoReporteDto;
  devolucion?: ProductoReporteDto;
  diferenciaKg: number;
}

@Component({
  standalone: true,
  selector: 'app-cuadre-reporte',
  imports: [CommonModule],
  templateUrl: './cuadre-reporte.component.html',
})
export class CuadreReporteComponent implements OnInit {
  despachoId!: string;
  reporte: CuadreReporteDto | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private reporteService: CuadreReporteService
  ) {}

  ngOnInit(): void {
    console.log('🟢 CuadreReporteComponent inicializado');

    this.route.paramMap.subscribe((params) => {
      const id = params.get('despachoId');
      console.log('📦 despachoId desde la ruta:', id);

      if (!id) {
        console.warn('❌ No se recibió el ID de despacho en la URL.');
        this.cargando = false;
        return;
      }

      this.despachoId = id;

      this.reporteService.obtenerReporte(id).subscribe({
        next: (data) => {
          console.log('✅ Reporte recibido:', data);
          this.reporte = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('❌ Error al cargar el reporte:', err);
          this.cargando = false;
        }
      });
    });
  }

  /**
   * Genera una tabla comparativa entre entregas y devoluciones,
   * emparejadas por índice y con diferencia de kilos calculada.
   */
  get filasComparadas(): FilaCuadre[] {
    if (!this.reporte) return [];

    const entregas = this.reporte.productosEntregados ?? [];
    const devoluciones = this.reporte.productosDevueltos ?? [];
    const maxLength = Math.max(entregas.length, devoluciones.length);

    const filas: FilaCuadre[] = [];

    for (let i = 0; i < maxLength; i++) {
      const entrega = entregas[i];
      const devolucion = devoluciones[i];
      const diferenciaKg = (entrega?.pesoKg ?? 0) - (devolucion?.pesoKg ?? 0);

      filas.push({ entrega, devolucion, diferenciaKg });
    }

    return filas;
  }

  /** Total de kilos entregados */
  get totalEntregadoKg(): number {
    return this.reporte?.productosEntregados?.reduce((sum, p) => sum + p.pesoKg, 0) ?? 0;
  }

  /** Total de kilos devueltos */
  get totalDevueltoKg(): number {
    return this.reporte?.productosDevueltos?.reduce((sum, p) => sum + p.pesoKg, 0) ?? 0;
  }

  /** Diferencia total de kilos */
  get diferenciaKilosTotales(): number {
    return this.totalEntregadoKg - this.totalDevueltoKg;
  }

  imprimir(): void {
    window.print();
  }
}
