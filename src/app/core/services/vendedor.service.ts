import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface VendedorDto {
  id: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private apiUrl = `${environment.apiUrl}/vendedores`; // 🔁 Ajusta con tu API real

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<VendedorDto[]> {
    return this.http.get<VendedorDto[]>(this.apiUrl);
  }
}
