import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface RutaDto {
  id: string;
  despachoId: string;
  direccion: string;
  nombreCliente: string;
  latitud: number;
  longitud: number;
}

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private apiUrl = `${environment.apiUrl}/rutas`; // 🔁 Cambia la URL según tu API real

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<RutaDto[]> {
    return this.http.get<RutaDto[]>(this.apiUrl);
  }
}
