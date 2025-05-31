import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { RolesPermisosService } from '../../core/services/roles-permisos.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html'
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  mensaje: string | null = null;
  cargando = false;
  rolesDisponibles: any[] = []; // Se llenará desde el servicio de roles

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolesService: RolesPermisosService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rolId: [null, Validators.required] // Aquí se cargará el rol seleccionado
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  // Cargar roles desde el backend
  async cargarRoles() {
    try {
      this.rolesDisponibles = await this.rolesService.getRoles();
    } catch (error) {
      console.error('Error cargando roles', error);
      this.mensaje = 'Error al cargar roles. Intenta nuevamente.';
    }
  }

  // Validador personalizado para el celular (opcional)
  celularValidoValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^\+?\d{9,15}$/;
      return regex.test(control.value) ? null : { celularInvalido: true };
    };
  }

  registrar() {
    if (this.registroForm.valid) {
      this.cargando = true;
      this.mensaje = null;

      // Buscar el nombre del rol seleccionado
      const rolSeleccionado = this.rolesDisponibles.find(r => r.id === this.registroForm.value.rolId);

      const registro = {
        nombre: this.registroForm.value.nombre,
        email: this.registroForm.value.email,
        passwordHash: this.registroForm.value.password,
        rolId: this.registroForm.value.rolId,
        rol: rolSeleccionado ? rolSeleccionado.nombre : '' // Asegúrate de enviar el nombre del rol
      };

      this.usuarioService.registrar(registro).subscribe({
        next: () => {
          this.mensaje = 'Registro exitoso.!!';
          this.cargando = false;
          this.registroForm.reset();
          this.cargarRoles();
        },
        error: (err) => {
          this.mensaje = 'Error al registrar: ' + (err.error?.error ?? err.message);
          this.cargando = false;
        }
      });
    } else {
      this.mensaje = 'Por favor completa todos los campos correctamente.';
    }
  }
}
