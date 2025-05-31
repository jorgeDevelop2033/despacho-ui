// src/app/shared/tipo-precio-select.component.ts
import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // IMPORTANTE
import { ProductoService } from '../core/services/producto.service';
import { TipoPrecioDto } from '../models/tipo-precio.model';


@Component({
  selector: 'app-tipo-precio-select',
  standalone: true,
  imports: [CommonModule, FormsModule], // AÑADIR FormsModule
  template: `
    <select [ngModel]="selected" (ngModelChange)="selectedChange.emit($event)" class="p-2 border rounded w-full">
      <option *ngFor="let tipo of tipoPrecios" [value]="tipo.id">{{ tipo.nombre }}</option>
    </select>
  `
})
export class TipoPrecioSelectComponent implements OnInit {
  @Input() selected!: number;
  @Output() selectedChange = new EventEmitter<number>();

  tipoPrecios: TipoPrecioDto[] = [];
  private productoService = inject(ProductoService);

  ngOnInit() {
    this.productoService.obtenerTipoPrecios().subscribe(data => this.tipoPrecios = data);
  }
}
