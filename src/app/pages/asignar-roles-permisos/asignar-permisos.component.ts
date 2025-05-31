import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolesPermisosService } from '../../core/services/roles-permisos.service';
  // Ajusta ruta según tu proyecto

@Component({
  selector: 'app-asignar-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar-permisos.component.html'
})
export class AsignarPermisosComponent implements OnInit {
  roles: any[] = [];
  permisos: any[] = [];
  selectedRolId: string | null = null;
  selectedPermisos: Set<string> = new Set();

  constructor(private service: RolesPermisosService) {}

  async ngOnInit() {
    this.roles = await this.service.getRoles();
    this.permisos = await this.service.getPermisos();
  }

  togglePermiso(permisoId: string) {
    if (this.selectedPermisos.has(permisoId)) {
      this.selectedPermisos.delete(permisoId);
    } else {
      this.selectedPermisos.add(permisoId);
    }
  }

  async guardar() {
    if (!this.selectedRolId) {
      alert('Selecciona un rol.');
      return;
    }

    try {
      await this.service.asignarPermisos(this.selectedRolId, Array.from(this.selectedPermisos));
      alert('Permisos asignados correctamente.');
    } catch (error) {
      console.error('Error al asignar permisos:', error);
      alert('Hubo un error al asignar permisos.');
    }
  }
}
