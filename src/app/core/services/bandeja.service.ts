// src/app/core/services/bandeja.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface BandejaDto {
  id: string;
  pesoKg: number;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class BandejaService {
  private apiUrl = `${environment.apiUrl}/bandejas/listartodos`;

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<BandejaDto[]> {
    return this.http.get<BandejaDto[]>(this.apiUrl);
  }
}
