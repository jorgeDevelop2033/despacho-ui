import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface BalanceSemanal {
  fecha: string;
  diaSemana: string;
  productoId: string;
  productoNombre: string;
  totalEntregadoKg: number;
  totalDevueltoKg: number;
  balanceKg: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = `${environment.apiUrl}/balance-semanal-actual`;

  constructor(private http: HttpClient) {}

  obtenerBalanceSemanal(): Observable<BalanceSemanal[]> {
    return this.http.get<BalanceSemanal[]>(this.apiUrl);
  }
}