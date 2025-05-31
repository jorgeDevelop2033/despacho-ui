// src/app/productos/producto-form.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ProductoService } from '../../core/services/producto.service';
import { TipoPrecioDto } from '../../core/services/tipo-precio.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './producto-form.component.html'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    codigoBarra: ['', Validators.required],
    precios: this.fb.array([])
  });

  tipoPrecios: TipoPrecioDto[] = [];

  get precios(): FormArray {
    return this.form.get('precios') as FormArray;
  }

  ngOnInit() {
    this.productoService.obtenerTipoPrecios().subscribe(data => {
      this.tipoPrecios = data;
      if (this.tipoPrecios.length) {
        this.agregarPrecio();
      }
    });
  }


  agregarPrecio() {
    this.precios.push(this.fb.group({
      tipoPrecioId: [this.tipoPrecios.length ? this.tipoPrecios[0].id : '', Validators.required],
      valor: [0, Validators.required]
    }));
  }

  guardar() {
    if (this.form.valid) {
      this.productoService.crearProducto(this.form.value).subscribe(() => {
        alert('Producto creado correctamente');
        this.form.reset();
        this.precios.clear();
        this.agregarPrecio(); // Reiniciar con un grupo por defecto
      });
    } else {
      alert('Por favor completa todos los campos');
    }
  }

  eliminarPrecio(index: number) {
    this.precios.removeAt(index);
  }

  formatCLP(valor: number): string {
    if (!valor) return '';
    return '$ ' + valor.toLocaleString('es-CL');
  }

  onInputPrecio(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^\d]/g, ''); // Solo números
    const numericValue = parseInt(value, 10) || 0;
    this.precios.at(index).get('valor')?.setValue(numericValue);
    input.value = this.formatCLP(numericValue);
  }

}
