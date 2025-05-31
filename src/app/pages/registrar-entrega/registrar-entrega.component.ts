import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductoService } from '../../core/services/producto.service';
import { TipoPrecioService, TipoPrecioDto } from '../../core/services/tipo-precio.service';
import { ClienteService, ClienteDto } from '../../core/services/cliente.service';
import { RutaService, RutaDto } from '../../core/services/ruta.service';
import { VendedorService, VendedorDto } from '../../core/services/vendedor.service';
import { DespachoService } from '../../core/services/despacho.service';
import { BandejaDto, BandejaService } from '../../core/services/bandeja.service';
import { ProductoDto } from '../../models/producto.models';

type BandejaItem = {
  id: string;
  descripcion: string;
  cantidad: number;
  pesoKg: number;
};

@Component({
  selector: 'app-pantalla-despacho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-entrega.component.html',
  animations: [
    trigger('stepTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-12px)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class RegistrarEntregaComponent implements OnInit {
  step = 1;

  form = {
    fecha: '',
    tipoPrecio: null as TipoPrecioDto | null,
    origen: '',
    cliente: null as ClienteDto | null,
    ruta: null as RutaDto | null,
    vendedor: null as VendedorDto | null
  };

  tiposPrecio: TipoPrecioDto[] = [];
  clientes: ClienteDto[] = [];
  rutas: RutaDto[] = [];
  vendedores: VendedorDto[] = [];
  productos: ProductoDto[] = [];
  bandejasDisponibles: BandejaDto[] = [];

  items: {
    producto: ProductoDto | null;
    precio: number;
    kilos: number;
    pesoOriginal?: number;
    fotos: string[];
    inputsExtra: any[];
    bandejas: Record<string, BandejaItem>;
  }[] = [];

  observaciones = '';

  constructor(
    private productoService: ProductoService,
    private tipoPrecioService: TipoPrecioService,
    private clienteService: ClienteService,
    private rutaService: RutaService,
    private vendedorService: VendedorService,
    private despachoService: DespachoService,
    private bandejaService: BandejaService
  ) {}

  ngOnInit(): void {
    this.tipoPrecioService.obtenerTodos().subscribe({
      next: data => this.tiposPrecio = data,
      error: err => console.error('Error cargando tipos de precio:', err)
    });

    this.clienteService.obtenerTodos().subscribe({
      next: data => this.clientes = data,
      error: err => console.error('Error cargando clientes:', err)
    });

    this.rutaService.obtenerTodas().subscribe({
      next: data => this.rutas = data,
      error: err => console.error('Error cargando rutas:', err)
    });

    this.vendedorService.obtenerTodos().subscribe({
      next: data => this.vendedores = data,
      error: err => console.error('Error cargando vendedores:', err)
    });

    this.bandejaService.obtenerTodas().subscribe({
      next: data => this.bandejasDisponibles = data,
      error: err => console.error('Error cargando bandejas:', err)
    });

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    this.form.fecha = `${year}-${month}-${day}`;
  }

  setTipoPrecio(tipo: TipoPrecioDto) {
    this.form.tipoPrecio = tipo;
    if (tipo?.id) {
      this.cargarProductosPorTipoPrecio(tipo.id);
    }
  }

  cargarProductosPorTipoPrecio(tipoPrecioId: number) {
    this.productoService.obtenerPorTipoPrecio(tipoPrecioId).subscribe({
      next: data => {
        this.productos = data;
        this.items = [];
      },
      error: err => console.error('Error cargando productos:', err)
    });
  }

  /** FILTRO DE PRODUCTOS DISPONIBLES PARA EVITAR DUPLICADOS **/
  productosDisponibles(index: number) {
    return this.productos.filter(p =>
      !this.items.some((item, i) => i !== index && item.producto?.id === p.id)
    );
  }

  agregarItem() {
    this.items.push({
      producto: null,
      precio: 0,
      kilos: 0,
      fotos: [],
      inputsExtra: [],
      bandejas: {}
    });
  }

  eliminarProducto(index: number) {
    this.items.splice(index, 1);
    this.items = [...this.items];
  }

  eliminarFoto(productoIndex: number, fotoIndex: number) {
    this.items[productoIndex].fotos.splice(fotoIndex, 1);
    this.items[productoIndex].fotos = [...this.items[productoIndex].fotos];
  }

  onFilesChange(event: any, index: number) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.items[index].fotos.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  agregarInputImagen(index: number): void {
    this.items[index].inputsExtra.push(Date.now());
  }

  verImagen(url: string): void {
    window.open(url, '_blank');
  }

  formularioValidoPaso2(): boolean {
    return this.items.length > 0 && this.items.every(item => item.producto && item.precio > 0 && item.kilos > 0);
  }

  actualizarPrecioProducto(item: any) {
    if (item.producto?.precio) {
      item.precio = item.producto.precio;
      if (item.producto?.pesoOriginal) {
        const peso = typeof item.producto.pesoOriginal === 'string'
          ? parseFloat(item.producto.pesoOriginal)
          : item.producto.pesoOriginal;
        if (item.pesoOriginal === undefined || item.pesoOriginal === 0) {
          item.pesoOriginal = peso;
          item.kilos = peso;
        }
      }
    }
  }

  registrarPesoOriginal(item: any): void {
    if (item.pesoOriginal == null || item.pesoOriginal === 0) {
      item.pesoOriginal = item.kilos;
    }
  }

  actualizarCantidadBandeja(itemIndex: number, bandejaId: string, cantidad: number) {
    const item = this.items[itemIndex];
    const bandeja = this.bandejasDisponibles.find(b => b.id === bandejaId);
    if (!bandeja) return;

    if (!item.bandejas[bandejaId]) {
      item.bandejas[bandejaId] = {
        id: bandeja.id,
        descripcion: bandeja.descripcion,
        cantidad: 0,
        pesoKg: bandeja.pesoKg
      };
    }

    item.bandejas[bandejaId].cantidad = cantidad;
    this.recalcularKilos(item);
  }

  recalcularKilos(item: any): void {
    const bandejas: BandejaItem[] = Object.values(item.bandejas ?? {});
    const pesoBandejasTotal = bandejas.reduce((acc, b) => acc + b.pesoKg * b.cantidad, 0);
    const pesoOriginal = item.pesoOriginal ?? 0;
    item.kilos = Math.max(0, parseFloat((pesoOriginal - pesoBandejasTotal).toFixed(2)));
  }

  calcularTotalBandejas(item: { bandejas: Record<string, { cantidad: number; pesoKg: number }> }): number {
    return Object.values(item.bandejas).reduce((acc, b) => acc + (b.cantidad ?? 0) * (b.pesoKg ?? 0), 0);
  }

  calcularKilosNetos(item: any): number {
    const totalBandejas = this.calcularTotalBandejas(item);
    return Math.max(0, parseFloat((item.kilos - totalBandejas).toFixed(2)));
  }

  calcularTotalProducto(item: any): number {
    const kilosNetos = this.calcularKilosNetos(item);
    return parseFloat((item.precio * kilosNetos).toFixed(2));
  }

  obtenerDiaSemana(fecha: string): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dia = new Date(fecha).getDay();
    return dias[dia];
  }

  generarDespacho() {
    const payload = {
      rutaId: this.form.ruta?.id ?? null,
      clienteId: this.form.cliente?.id ?? null,
      vendedorId: this.form.vendedor?.id ?? null,
      fecha: this.form.fecha,
      diaSemana: this.obtenerDiaSemana(this.form.fecha),
      tipoPrecioId: this.form.tipoPrecio?.id ?? 0,
      productos: this.items
        .filter(item => item.producto)
        .map(item => ({
          productoId: item.producto!.id?.toString() ?? null,
          pesoKg: item.kilos,
          observacion: '',
          precioUnitario: item.precio,
          fotos: item.fotos.map(url => ({ url })),
          bandejas: Object.values(item.bandejas).map(b => ({
            id: b.id,
            descripcion: b.descripcion,
            cantidad: b.cantidad,
            pesoKg: b.pesoKg
          }))
        }))
    };

    this.despachoService.crearDespacho(payload).subscribe({
      next: () => alert('Despacho generado exitosamente'),
      error: err => {
        console.error('❌ Error al generar despacho:', err);
        if (err.error?.message) {
          alert(`Error: ${err.error.message}`);
        } else {
          alert('Error al generar el despacho.');
        }
      }
    });
  }
}
