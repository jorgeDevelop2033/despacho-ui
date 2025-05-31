import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DevolucionesService } from '../../../core/services/devolucionproducto.service';
import { BandejaService, BandejaDto } from '../../../core/services/bandeja.service';
import { EntregaProductoDto, DevolucionProductoDto, DespachoDetalleDto, FotoDto } from '../../../models/despacho-detalle.model';

interface ProductoAgrupado {
  productoId: string;
  productoNombre: string;
  entrega?: EntregaProductoDto;
  devolucion?: DevolucionProductoDto & { pesoOriginalIngresado?: number };
  bandejas: { [bandejaId: string]: { id: string; descripcion: string; pesoKg: number; cantidad: number } };
}

@Component({
  selector: 'app-devolucion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './devolucion-form.component.html',
})
export class DevolucionFormComponent implements OnInit {
  despachoId = '';
  despacho: DespachoDetalleDto | null = null;
  productosAgrupados: ProductoAgrupado[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';
  envioExitoso = false;
  toastVisible = false;
  toastMensaje = '';
  toastColor = 'bg-green-600';
  imagenPreview: string | null = null;
  mostrarModal = false;
  step = 2;
  bandejasDisponibles: BandejaDto[] = [];

  constructor(
    private devolucionesService: DevolucionesService,
    private bandejaService: BandejaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      this.despachoId = idFromRoute;
      this.cargarDatosIniciales();
    }
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    this.hasError = false;

    this.bandejaService.obtenerTodas().subscribe({
      next: bandejas => {
        this.bandejasDisponibles = bandejas;
        this.completarDevoluciones();
      },
      error: err => {
        console.error('Error al cargar bandejas', err);
        this.hasError = true;
        this.errorMessage = 'Error al cargar bandejas.';
        this.isLoading = false;
      }
    });
  }

  completarDevoluciones(): void {
    this.devolucionesService.obtenerPorDespacho(this.despachoId).subscribe({
      next: (data) => {
        if (data && Array.isArray(data.entregas) && Array.isArray(data.devoluciones)) {
          this.despacho = data;

          this.despacho.entregas.forEach(entrega => {
            entrega.fotos = entrega.fotos.map((foto: string | FotoDto) => typeof foto === 'string' ? { url: foto } : foto);
          });

          this.despacho.devoluciones.forEach(devolucion => {
            devolucion.fotos = devolucion.fotos.map((foto: string | FotoDto) => typeof foto === 'string' ? { url: foto } : foto);
          });

          this.agruparProductos();
        } else {
          this.hasError = true;
          this.errorMessage = 'Formato del despacho inválido.';
        }
        this.isLoading = false;
        this.step = 2;
      },
      error: err => {
        this.hasError = true;
        this.isLoading = false;
        this.errorMessage = 'Error al cargar devoluciones.';
        console.error(err);
      }
    });
  }

  agruparProductos(): void {
    const map = new Map<string, ProductoAgrupado>();

    for (const entrega of this.despacho!.entregas) {
      map.set(entrega.productoId, {
        productoId: entrega.productoId,
        productoNombre: entrega.productoNombre,
        entrega,
        bandejas: {}
      });
    }

    for (const devolucion of this.despacho!.devoluciones) {
      const existente = map.get(devolucion.productoId);
      if (existente) {
        existente.devolucion = { ...devolucion };
      } else {
        map.set(devolucion.productoId, {
          productoId: devolucion.productoId,
          productoNombre: devolucion.productoNombre,
          devolucion: { ...devolucion },
          bandejas: {}
        });
      }
    }

    this.productosAgrupados = Array.from(map.values());
  }

  onPesoKgManualChange(item: ProductoAgrupado) {
    if (item.devolucion) {
      item.devolucion.pesoOriginalIngresado = item.devolucion.pesoKg;
      Object.keys(item.bandejas).forEach(key => item.bandejas[key].cantidad = 0);
      this.recalcularKilos(item);
    }
  }

  recalcularKilos(item: ProductoAgrupado) {
    if (!item.devolucion) return;
    const pesoBase = item.devolucion.pesoOriginalIngresado ?? item.devolucion.pesoKg;
    const totalBandejasKg = Object.values(item.bandejas).reduce((acc, b) => acc + b.cantidad * b.pesoKg, 0);
    item.devolucion.pesoKg = Math.max(0, parseFloat((pesoBase - totalBandejasKg).toFixed(2)));
    item.devolucion.total = parseFloat((item.devolucion.pesoKg * item.devolucion.precioUnitario).toFixed(2));
  }

  onFilesChange(event: Event, item: ProductoAgrupado) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !item.devolucion) return;
    const archivos = Array.from(input.files);
    for (const archivo of archivos) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        item.devolucion!.fotos.push({ url });
      };
      reader.readAsDataURL(archivo);
    }
    input.value = '';
  }

  eliminarFoto(item: ProductoAgrupado, index: number) {
    item.devolucion?.fotos.splice(index, 1);
  }

  verImagen(url: string) {
    this.imagenPreview = url;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.imagenPreview = null;
  }

  confirmarDevolucion() {
    const devoluciones = this.productosAgrupados
      .filter(p => p.devolucion)
      .map(p => {
        const { pesoOriginalIngresado, ...rest } = p.devolucion!;
        return rest as DevolucionProductoDto;
      });

    if (!devoluciones.length) {
      this.mostrarToast('Debe haber al menos una devolución válida', 'bg-yellow-600');
      return;
    }

    this.devolucionesService.actualizarDevoluciones(devoluciones).subscribe({
      next: () => {
        this.envioExitoso = true;
        this.mostrarToast('Devoluciones actualizadas con éxito', 'bg-green-600');
      },
      error: err => {
        this.envioExitoso = false;
        this.mostrarToast('Error al actualizar devoluciones', 'bg-red-600');
        console.error(err);
      }
    });
  }

  mostrarToast(mensaje: string, color = 'bg-green-600') {
    this.toastMensaje = mensaje;
    this.toastColor = color;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3000);
  }
}
