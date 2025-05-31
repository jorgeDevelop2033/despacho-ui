import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'  // Registra automáticamente el servicio en el root
})
export class RolesPermisosService {
  private baseUrl = `${environment.apiUrl}`;   // Cambiar según tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los roles
  async getRoles(): Promise<any[]> {
    return await firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/roles`));
  }

  // Obtener todos los permisos
  async getPermisos(): Promise<any[]> {
    return await firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/permisos`));
  }

  // Asignar permisos a un rol
  async asignarPermisos(rolId: string, permisoIds: string[]): Promise<void> {
    const body = { rolId, permisoIds };
    await firstValueFrom(this.http.post<void>(`${this.baseUrl}/roles/asignar-permisos`, body));
  }
}
