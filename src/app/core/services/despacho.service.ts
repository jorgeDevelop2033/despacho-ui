import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { tap } from 'rxjs/operators';

export interface CrearDespachoDto {
  rutaId: string | null;
  clienteId: string | null;
  vendedorId: string | null;
  fecha: string;
  diaSemana: string;
  tipoPrecioId: number;
  productos: {
    productoId: string | null;
    pesoKg: number;
    observacion: string;
    precioUnitario: number;
    fotos: { url: string }[];
    bandejas: { id: string; descripcion: string; cantidad: number; pesoKg: number }[];
  }[];
}

export interface DespachoBusquedaDto {
  id: string;
  vendedorId: string;
  nombreVendedor: string;
  clienteId: string;
  nombreCliente: string;
  tipoPrecioDescripcion: string;
  fecha: string; // Asegúrate que tu backend lo incluya
}

@Injectable({
  providedIn: 'root'
})
export class DespachoService {
  private apiUrl = `${environment.apiUrl}/despachos/completo/`; // Reemplaza con tu endpoint real
  private apiResumenUrl = `${environment.apiUrl}/despachos/resumen/`;

  constructor(private http: HttpClient) {}

  crearDespacho(dto: CrearDespachoDto): Observable<any> {
    console.log('dto', dto);
    return this.http.post(this.apiUrl, dto);
  }

  obtenerDespachos(fecha?: string): Observable<DespachoBusquedaDto[]> {
    const url = fecha ? `${this.apiResumenUrl}${fecha}` : this.apiResumenUrl;

    return this.http.get<DespachoBusquedaDto[]>(url).pipe(
      tap(response => {
        console.log('Respuesta de despachos:', response);
      })
    );
  }

}


