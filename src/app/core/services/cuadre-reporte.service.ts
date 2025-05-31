import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CuadreReporteDto } from '../../models/cuadre-reporte.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class CuadreReporteService {
  constructor(private http: HttpClient) {}

  obtenerReporte(despachoId: string): Observable<CuadreReporteDto> {
    return this.http.get<CuadreReporteDto>(`${environment.apiUrl}/cuadres/reporte/${despachoId}`);
  }
}