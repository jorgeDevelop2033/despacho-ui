import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { UsuarioRegistro } from '../../models/usuario-registro.model';


@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  registrar(usuario: UsuarioRegistro): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario)
    .pipe(
      catchError(err => {
        return throwError(() => err);  // Propagamos el error al componente
      })
    );
  }
}
