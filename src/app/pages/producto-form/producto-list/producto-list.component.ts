import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../models/producto.models';
import { TipoPrecioDto } from '../../../models/tipo-precio.model';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-list.component.html'
})
export class ProductoListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private fb = inject(FormBuilder);

  productos: ProductoDto[] = [];
  tipoPrecios: TipoPrecioDto[] = [];
  form!: FormGroup;
  productoSeleccionado: ProductoDto | null = null;

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe(productos => this.productos = productos);
    this.productoService.obtenerTipoPrecios().subscribe(tipos => this.tipoPrecios = tipos);
  }

  seleccionarProducto(producto: ProductoDto) {
    this.productoSeleccionado = producto;
    const precio = producto.precios[0];  // Asumo que es uno, ajústalo si necesitas
    this.form = this.fb.group({
      tipoPrecioId: [precio?.tipoPrecioId || null],
      valor: [precio?.valor || 0]
    });
  }

  guardarCambios() {
    if (!this.productoSeleccionado) return;

    const data = {
      tipoPrecioId: this.form.value.tipoPrecioId,
      valor: this.form.value.valor
    };

    this.productoService.actualizarPrecioProducto(this.productoSeleccionado.id, data)
      .subscribe(() => {
        alert('Precio actualizado correctamente.');
        this.productoSeleccionado = null;  // Reset
      });
  }
}
