import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DespachoDetalleDto, DevolucionProductoDto } from '../../models/despacho-detalle.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  private readonly apiUrl = `${environment.apiUrl}/devoluciones`;
  constructor(private http: HttpClient) {}

  //GET
  obtenerPorDespacho(despachoId: string): Observable<DespachoDetalleDto> {
    const url = `${environment.apiUrl}/despachos/${despachoId}`;
    console.log(url);
    return this.http.get<DespachoDetalleDto>(url).pipe(
      tap(response => {

        console.log('Despacho con entregas y devoluciones:', response);
      })
    );
  }

  //PUT
  actualizarDevoluciones(devoluciones: DevolucionProductoDto[]): Observable<void> {
    const url = `${this.apiUrl}`;
    return this.http.put<void>(url, devoluciones).pipe(
      tap(() => {
        console.log( devoluciones + 'Devoluciones actualizadas exitosamente');
      })
    );
  }
}