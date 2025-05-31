import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-crear-ruta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-ruta.component.html'
})
export class CrearRutaComponent {
  rutaForm: FormGroup;

  vendedores = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Gómez' }
  ];

  constructor(private fb: FormBuilder) {
    this.rutaForm = this.fb.group({
      fecha: [''],
      vendedorId: ['']
    });
  }

  onSubmit() {
    console.log(this.rutaForm.value);
  }
}
