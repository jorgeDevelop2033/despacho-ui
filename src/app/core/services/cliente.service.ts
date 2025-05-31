import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface ClienteDto {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`; // 🔁 Ajusta la URL real

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<ClienteDto[]> {
    return this.http.get<ClienteDto[]>(this.apiUrl);
  }
}
