import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../models/login-request.model';
import { environment } from '../../../environments/environments';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, request);
  }
}
