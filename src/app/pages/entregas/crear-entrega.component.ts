import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-crear-entrega',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-entrega.component.html'
})
export class CrearEntregaComponent {
  entregaForm: FormGroup;

  productos = [
    { id: 1, nombre: 'Papa' },
    { id: 2, nombre: 'Tomate' }
  ];

  constructor(private fb: FormBuilder) {
    this.entregaForm = this.fb.group({
      productoId: [''],
      kilos: [''],
      foto: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.entregaForm.patchValue({ foto: file });
  }

  onSubmit() {
    console.log(this.entregaForm.value);
  }
}
