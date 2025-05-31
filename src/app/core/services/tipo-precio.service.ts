import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface TipoPrecioDto {
  id: number;
  nombre: string;
  valorDefault: number;
}

@Injectable({
  providedIn: 'root'
})
export class TipoPrecioService {
  private apiUrl = `${environment.apiUrl}/ObtenerTiposPrecio`; // 🔁 reemplaza con tu URL real

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<TipoPrecioDto[]> {
    return this.http.get<TipoPrecioDto[]>(this.apiUrl);
  }
}